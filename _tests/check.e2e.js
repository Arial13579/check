// CHECK: short quote links (?k=) against the Firestore + Auth emulators with the real rules.
// Setup (as in system.snapbox/_tests): deps in $S/t/node_modules (playwright-core, firebase, firebase-tools, axe-core, html2canvas, jspdf, chart.js);
// static server: python3 -m http.server 8791 --bind 127.0.0.1 --directory $S/www, where $S/www/check -> /home/user/check;
// rules: copy system.snapbox/firestore.rules to $S/t/firestore.rules.
// Run from $S/t: ./node_modules/.bin/firebase emulators:exec --only firestore,auth --project check-b2a66 "node /home/user/check/_tests/check.e2e.js"
const S = '/tmp/claude-0/-home-user/33274e87-36f1-52fb-a542-54f1e7d0e4b6/scratchpad';
const NM = S + '/t/node_modules/', FB = NM + 'firebase/', FBV = require(NM + 'firebase/package.json').version;
const { chromium } = require(NM + 'playwright-core');
const fs = require('fs');
const AXE = fs.readFileSync(NM + 'axe-core/axe.min.js', 'utf8');
const SITE = 'http://localhost:8791/check/';
const EMU = 'http://127.0.0.1:8085/v1/projects/check-b2a66/databases/default/documents/';
const OWNER = 'arielkahalani1@gmail.com';
const SHOTS = S + '/chk2/shots/'; fs.mkdirSync(SHOTS, { recursive: true });
const errors = [];
let failures = 0;
const check = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) failures++; };
const H = { 'Access-Control-Allow-Origin': '*' };
const G = n => `https://www.gstatic.com/firebasejs/${FBV}/${n}`;
// The page imports 10.12.0 from gstatic: serve the local SDK, and connect it to the emulators.
const WRAP = {
  'firebase-app.js': `export * from '${G('firebase-app.js')}';`,
  'firebase-firestore.js': `export * from '${G('firebase-firestore.js')}';
import { getFirestore as _g, connectFirestoreEmulator as _c } from '${G('firebase-firestore.js')}';
export function getFirestore(app, id){ const db = _g(app, id); if (!db.__emu){ db.__emu = 1; _c(db, '127.0.0.1', 8085); } return db; }`,
  'firebase-auth.js': `export * from '${G('firebase-auth.js')}';
import * as A from '${G('firebase-auth.js')}';
export function getAuth(app){ const a = A.getAuth(app); if (!a.__emu){ a.__emu = 1; A.connectAuthEmulator(a, 'http://127.0.0.1:9099', { disableWarnings: true }); window.__auth = a; window.__authMod = A; } return a; }`
};
async function setup(ctx){
  await ctx.route('**/*', async route => {
    const u = route.request().url();
    const m = u.match(/gstatic\.com\/firebasejs\/([\d.]+)\/(firebase-(app|auth|firestore)\.js)$/);
    if (m && m[1] !== FBV) return route.fulfill({ body: WRAP[m[2]], contentType: 'application/javascript', headers: H });
    if (m) return route.fulfill({ body: fs.readFileSync(FB + m[2]), contentType: 'application/javascript', headers: H });
    if (u.endsWith('html2canvas.min.js')) return route.fulfill({ body: fs.readFileSync(NM + 'html2canvas/dist/html2canvas.min.js'), contentType: 'application/javascript' });
    if (u.endsWith('jspdf.umd.min.js')) return route.fulfill({ body: fs.readFileSync(NM + 'jspdf/dist/jspdf.umd.min.js'), contentType: 'application/javascript' });
    if (u.endsWith('chart.umd.min.js')) return route.fulfill({ body: fs.readFileSync(NM + 'chart.js/dist/chart.umd.js'), contentType: 'application/javascript' });
    if (u.includes('nominatim')) return route.fulfill({ body: '[{"lat":"32.794","lon":"34.989","display_name":"חיפה, מחוז חיפה, ישראל"}]', contentType: 'application/json' });
    if (u.includes('osrm')) return route.fulfill({ body: '{"routes":[{"distance":95300}]}', contentType: 'application/json' });
    if (u.startsWith('http://localhost') || u.includes('127.0.0.1')) return route.continue();
    if (u.includes('fonts.g')) return route.fulfill({ body: '', contentType: 'text/css' });
    return route.abort();
  });
}
async function newPage(b, name){
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'he-IL' });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://localhost:8791' });
  await setup(ctx);
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push(name + ': ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/404|ERR_FAILED|net::|favicon|Could not reach Cloud Firestore backend/.test(m.text())) errors.push(name + ' console: ' + m.text()); });
  p.on('dialog', d => d.accept());
  return { ctx, p };
}
const emuGet = async path => { const r = await fetch(EMU + path, { headers: { Authorization: 'Bearer owner' } }); return { status: r.status, body: await r.json() }; };
async function signIn(p, email, verified = true){
  await p.waitForFunction(() => window.__auth && window.__authMod, null, { timeout: 15000 });
  await p.evaluate(([e, v]) => __authMod.signInWithCredential(__auth, __authMod.GoogleAuthProvider.credential(JSON.stringify({ sub: 'u-' + e + v, email: e, email_verified: v }))), [email, verified]);
}
async function fillQuote(p, name){
  await p.fill('#in_clientName', name);
  await p.fill('#in_eventType', 'חתונה');
  await p.selectOption('#in_service', 'dj_sax');
  await p.fill('#in_location', 'גן אירועים הכרמל, חיפה'); await p.locator('#in_location').blur();
  await p.locator('#in_date').pressSequentially('12062027');
  await p.locator('#in_startTime').pressSequentially('1930');
  await p.locator('#in_endTime').pressSequentially('0100');
  await p.fill('#in_guests', '350'); await p.locator('#in_guests').dispatchEvent('input');
  await p.fill('#in_notes', 'שיר כניסה לחופה');
  await p.waitForTimeout(800);
}

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--ignore-certificate-errors'] });

  console.log('1. Owner creates a quote → short link');
  const A = await newPage(b, 'admin');
  await A.p.goto(SITE);
  await signIn(A.p, OWNER);
  await A.p.waitForSelector('#admin-section:not(.hidden)', { timeout: 15000 });
  await fillQuote(A.p, 'נועה ואיתי כהן');
  await A.p.click('#gen-btn');
  await A.p.waitForSelector('#link-result:not(.hidden)', { timeout: 15000 });
  const url = await A.p.inputValue('#shareable-url');
  check(/\/check\/\?k=[a-z0-9]{10}$/.test(url), 'link = short link (?k=): ' + url);
  const k = (url.match(/\?k=([a-z0-9]+)/) || [])[1];
  const wa = await A.p.getAttribute('#wa-share-btn', 'href');
  check(wa === 'https://wa.me/?text=' + encodeURIComponent(url), 'WhatsApp: only the short link (asks whom to send to)');
  check(await A.p.isEnabled('#gen-btn') && (await A.p.textContent('#gen-btn')).includes('צור קישור ללקוח'), 'generate button restored');
  check((await A.p.textContent('#link-result')).includes('קישור קצר'), 'result text: image + short link');
  await A.p.screenshot({ path: SHOTS + 'admin-result.png', fullPage: true });
  const sl = await emuGet('shortLinks/' + k);
  check(sl.status === 200 && sl.body.fields.kind.stringValue === 'quote' && sl.body.fields.tenant.stringValue === 'check' && sl.body.fields.q.stringValue.length > 60, 'shortLinks doc saved (kind quote, tenant check, q)');
  const q = sl.status === 200 ? sl.body.fields.q.stringValue : '';
  const quoteId = Buffer.from(q.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8').split('|')[10];
  let rec = null;
  for (let i = 0; i < 20 && !(rec && rec.status === 200); i++) { rec = await emuGet('check_quotes/' + quoteId); if (rec.status !== 200) await new Promise(r => setTimeout(r, 300)); }
  check(rec.status === 200 && rec.body.fields.shortId && rec.body.fields.shortId.stringValue === k, 'quote record saved with shortId');

  console.log('2. Customer opens the short link (no sign-in)');
  const C = await newPage(b, 'customer');
  await C.p.goto(url);
  await C.p.waitForURL(/\?q=/, { timeout: 15000 });
  await C.p.waitForSelector('#sig-canvas', { timeout: 15000 });
  check(C.p.url().includes('?q=' + q), 'short link opens the full quote');
  check((await C.p.textContent('#view_clientName')).includes('נועה ואיתי כהן'), 'customer sees the quote');
  await C.p.waitForTimeout(1500);
  await C.p.addScriptTag({ content: AXE });
  const v = await C.p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })).violations.filter(x => x.impact === 'serious' || x.impact === 'critical').map(x => x.id + ': ' + x.nodes.slice(0, 4).map(n => n.target.join(' ') + ' [' + (n.any[0] && n.any[0].message || '') + ']').join(' | ')));
  // Known, pre-existing: the CHECK theme's brand colors (white on orange, light text on lime) fail AA contrast.
  // Not part of the short-link change; reported, not counted.
  const other = v.filter(x => !x.startsWith('color-contrast'));
  check(!other.length, 'axe WCAG AA: no issues besides the known theme colors' + (other.length ? ':\n      ' + other.join('\n      ') : ''));
  if (v.length > other.length) console.log('  ℹ known theme contrast (pre-existing): ' + v.filter(x => x.startsWith('color-contrast')).map(x => x.split(' [')[0]).join(', ').slice(0, 200));
  await C.p.goto(SITE + '?k=zzzzzzzzzz');
  await C.p.waitForFunction(() => document.getElementById('client-view').textContent.includes('ההצעה לא נמצאה'), null, { timeout: 15000 });
  check(true, 'unknown short link: "quote not found" message');
  check(await C.p.isHidden('#admin-gate'), 'short link never shows the admin gate');
  await C.p.screenshot({ path: SHOTS + 'not-found.png' });

  console.log('3. Dashboard: copy = short link, delete removes the short link');
  await A.p.goto(SITE + 'dashboard.html');
  await A.p.waitForSelector('#tbody .copy-link', { timeout: 20000 });
  await A.p.click(`#tbody .copy-link[data-id="${quoteId}"]`);
  await A.p.waitForTimeout(400);
  const copied = await A.p.evaluate(() => navigator.clipboard.readText());
  check(copied === url, 'dashboard "copy link" = the same short link');
  await A.p.click(`#tbody .delete-row[data-id="${quoteId}"]`);
  let gone = false;
  for (let i = 0; i < 20 && !gone; i++) { gone = (await emuGet('shortLinks/' + k)).status === 404 && (await emuGet('check_quotes/' + quoteId)).status === 404; if (!gone) await new Promise(r => setTimeout(r, 300)); }
  check(gone, 'deleting the quote also deletes its short link');

  console.log('4. Fallback: short link can\'t be saved in time → full link');
  const F = await newPage(b, 'fallback');
  await F.ctx.route('**/google.firestore.v1.Firestore/Write/**', r => r.abort());   // no writes reach Firestore
  await F.p.goto(SITE);
  await signIn(F.p, OWNER);
  await F.p.waitForSelector('#admin-section:not(.hidden)', { timeout: 15000 });
  await fillQuote(F.p, 'בדיקת גיבוי');
  await F.p.click('#gen-btn');
  await F.p.waitForSelector('#link-result:not(.hidden)', { timeout: 20000 });
  const furl = await F.p.inputValue('#shareable-url');
  check(/\/check\/\?q=[A-Za-z0-9_-]{60,}$/.test(furl), 'falls back to the full link (?q=)');

  await b.close();
  if (errors.length) { console.log('\nPage errors:'); errors.forEach(e => console.log('  - ' + e)); }
  console.log(failures ? `\n${failures} FAILED` : '\nALL PASSED');
  process.exit(failures || errors.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
