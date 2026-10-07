# זיכרון הפרויקט — לקריאה בתחילת כל שיחה

> הקובץ הזה הוא ה"זיכרון" של הפרויקט. Claude קורא אותו אוטומטית בכל שיחה חדשה על ה-repository.
> לעדכן אותו בכל החלטה חשובה. **אסור** לשמור כאן סיסמאות או מפתחות סודיים.

## מי הבעלים
- מנהל המערכת: **arielkahalani1@gmail.com** (חשבון הגוגל שמתחבר לכל המערכות, וגם בעלי פרויקט ה-Firebase).
- GitHub: המשתמש **Arial13579**.
- עסקים נוספים של אותו בעלים (repositories נפרדים, לא לערבב):
  - **SnapBoxEvent**: אתר עמדת צילום, snapbox.co.il.
  - **SnapBoxEvent_quotation**: מערכת הצעות המחיר המקורית של Snap Box, שממנה שוכפלה מערכת זו.
  - **system.snapbox**: דף מכירה של מערכת הצעות המחיר, system.snapbox.co.il. מחיר השקה ₪1,499 כולל חודשיים תמיכה, מחיר רגיל ₪1,999, תמיכה ₪69 לחודש. וואטסאפ 051-2440252.
- המשתמש מדבר עברית, עובד הרבה מהטלפון ולא מתכנת. הסברים צריכים להיות בעברית פשוטה, צעד אחר צעד, עם שמות כפתורים מדויקים.

## מה יש כרגע ב-repository הזה (check)
מערכת הצעות מחיר וחוזים דיגיטליים ל-**DJ ולמוזיקאים**, במיתוג **CHECK**. אתר סטטי ב-GitHub Pages: https://arial13579.github.io/check/

| קובץ | תפקיד |
|---|---|
| `index.html` | בלי `?q=`: מסך מנהל (שער Google ואז מחולל הצעות). עם `?q=`: דף הלקוח (צפייה, חתימה, PDF, מייל, יומן) |
| `dashboard.html` | לוח בקרה: מדדים, גרפים (Chart.js), חיפוש, PDF חתום, העתקת קישור, מחיקה |
| `config.js` | `adminEmail`, `business` (שם/תיאור/מייל/טלפון), `firebase`, `firestoreDatabaseId` |
| `pricing.js` | `SERVICES` (הרכבים), `COMMON_ITEMS`, `GUEST_TIERS`, `TRAVEL_TIERS`, `EXTRA_FRACTION`, `termsList()`, `ORIGIN` |
| `theme.css` | עיצוב "פוסטר הופעה": נייר `#F3EEE4`, דיו `#16120E`, כתום `#FF4F1A`, ליים `#C8F230`, גופנים Heebo + Rubik |
| `icons.js` | אייקונים בתוך הקוד (`<i data-i="name">` ואז `CheckIcons.paint()`) |
| `firestore.rules` | כללי אבטחה (המשתמש מדביק אותם ידנית ב-Firebase, בלשונית **Security**) |
| `terms/privacy/accessibility/404.html`, `legal.css` | מסמכים משפטיים |
| `a11y.js`, `cookie-consent.js` | תפריט נגישות והודעת עוגיות |

**פורמט הקישור ללקוח:** `?q=` ואחריו base64url של השדות הבאים, מחוברים ב-`|` ובסדר הזה:
`name|eventType|location|date|startTime|endTime|guests|price|deposit|notes|quoteId|service`.
`dashboard.html` (בפונקציה `buildShareUrl`) חייב לבנות את הקישור באותו סדר בדיוק.

**קישור קצר (מ-2026-10-07, החלטת הבעלים: "תמונה + קישור" בכל המערכות):** ללקוח נשלח `?k=<מזהה>` (10 תווים a-z0-9).
- המנהל יוצר `shortLinks/{id}` = `{ q, kind:'quote', tenant:'check', createdAt }`. הכללים כבר מתירים: הבעלים יוצר, וכל אחד קורא לפי מזהה.
- ב-`check_quotes/{quoteId}` נשמר `shortId`.
- `?k=` נטען מ-`shortLinks` ועובר ל-`?q=` המלא. אם יצירת הקישור הקצר נכשלת (או לוקחת יותר מ-8 שניות), נשלח הקישור המלא.
- לוח הבקרה: "העתק קישור" מחזיר את הקישור הקצר, ומחיקת הצעה מוחקת גם את הקישור הקצר.
- וואטסאפ: `wa.me/?text=<הקישור הקצר>`. הלקוח מקבל את כרטיס התמונה (og-image.jpg) ומתחתיו את הקישור.
- בדיקה: `_tests/check.e2e.js` (Playwright מול אמולטורים, עם הכללים האמיתיים מ-`system.snapbox/firestore.rules`. ההוראות בראש הקובץ).

**חישוב המחיר:** בסיס ההרכב + תוספת לפי כמות מוזמנים + נסיעה מתל אביב (Nominatim/OSRM) + זמן נוסף מעבר ל-`hours`, מעוגל לרבע שעה.

**זרימת החתימה:**
1. (מ-2026-10-07 לא אוספים IP בכלל, לבקשת הבעלים. `getClientIp` מחזיר `null`.)
2. יוצרים PDF עם html2canvas + jsPDF (בדפדפן של הלקוח).
3. במקביל: שולחים מייל (Web3Forms אם יש מפתח, אחרת FormSubmit) ומעדכנים את Firestore ל-`status:'signed'` ואז מוסיפים `pdfData` (אם הקובץ עד 700KB).
4. רק בסוף מורידים את ה-PDF למכשיר (בגלל ספארי באייפון).

## Firebase
- פרויקט: **check-b2a66** (בחשבון arielkahalani1@gmail.com). Analytics כבוי.
- ⚠️ **מסד הנתונים נקרא `default` ולא `(default)`.** לכן `firestoreDatabaseId: 'default'` ב-`config.js`, ו-`getFirestore(app, id)` בקוד.
  נבדק דרך ה-REST API: `(default)` מחזיר 404, ו-`default` מחזיר 403 (כלומר המסד קיים והכללים פעילים).
- Collection: `check_quotes`.
- התחברות עם Google מופעלת, והדומיין `arial13579.github.io` מאושר (נבדק עם `accounts:createAuthUri`).
- בממשק החדש של Firebase הלשונית **Rules** נקראת **Security**.
- Web3Forms: לא מוגדר (`WEB3FORMS_KEY` ריק). FormSubmit צריך הפעלה חד-פעמית במייל, דרך הכפתור "Activate Form".

## שירותי צד שלישי
GitHub Pages · Firebase (Auth + Firestore, ה-SDK נטען מ-gstatic) · FormSubmit · Web3Forms (לא פעיל) · tmpfiles.org (עותק PDF לשעה) · Nominatim · OSRM · cdnjs (html2canvas, jsPDF) · jsDelivr (Chart.js) · Google Fonts · wa.me · Google Calendar / Android intent.

## ⚠️ עדכון 2026-10-06: מערכת הספקים נבנתה ב-repository ‏system.snapbox
הזיכרון המלא נמצא שם, ב-`.claude/CLAUDE.md`. בקצרה:
- כניסת ספקים ולוח ניהול: system.snapbox.co.il/vendors/
- צד הלקוח: אתר ניטרלי (`hatzaa`), כרגע שמור ב-`_customer-site/`.
- הנתונים נשמרים בפרויקט Firebase הזה (check-b2a66) תחת `tenants/{slug}/quotes`. כללים חדשים פורסמו, ו-`check_quotes` ממשיך לעבוד.
הסעיף הבא הוא התכנון המקורי, ונשאר לתיעוד.

## התוכנית הבאה: מכירת המערכת לעסקים אחרים (הוחלט 2026-10-06)
**המודל:**
- מערכת אחת שבה הרבה לקוחות (multi-tenant), באותו פרויקט Firebase של הבעלים.
- לכל לקוח כתובת משלו (`.../<slug>`), עם מיתוג, מחירון וחוזה משלו.
- **הבעלים לא רוצה לעשות כלום חוץ מלאסוף מידע מהלקוח ולבדוק.** Claude בונה הכל.

**החלטות:**
- **לא מבקשים סיסמאות של לקוחות. אף פעם.** הלקוח מתחבר עם ה-Gmail שלו, וצריך רק את כתובת המייל שלו.
- **לבעלים יש "מפתח ראשי":** arielkahalani1@gmail.com יכול להיכנס לכל מערכת של לקוח לצורך בדיקות. לכתוב את זה בחוזה עם הלקוח.
- כל לקוח רואה רק את הנתונים שלו. האכיפה היא בכללי Firestore, לפי מסמך `tenants/{slug}` עם רשימת מנהלים.
- לוח בקרה ראשי לבעלים: כל הלקוחות, כמות הצעות וכמה נחתמו.
- **באתרים של הלקוחות לא יהיה שום קשר ל-"check":** לא בשם, לא במיתוג ולא בכתובת. צריך שם ניטרלי לפלטפורמה, ועדיף דומיין משלה.
- CHECK של הבעלים יהיה פשוט עוד לקוח במערכת.

**מה מקבלים מכל לקוח (טופס קליטה):**
1. פרטי עסק ומיתוג: שם לחוזה, שורת תיאור, לוגו (SVG או PNG שקוף), צבעים או "תחליט אתה", עוסק/ח.פ, טלפון, עיר יציאה.
2. חשבון: כתובת Gmail להתחברות (בלי סיסמה), מייל לקבלת חוזים חתומים, שם רצוי לכתובת (slug).
3. מחירון וחוזה: חבילות או הרכבים (מחיר, שעות כלולות, מחיר לשעה נוספת), מה כלול, תוספות לפי מוזמנים ומרחק, מקדמה, תנאי ביטול ותשלום.
4. פעולה יחידה של הלקוח: לחיצה על "Activate" במייל מ-FormSubmit.

**סדר העבודה לכל לקוח:** הבעלים שולח את הנתונים, Claude מקים, הבעלים בודק עם ה-Gmail שלו, תיקונים, ואז שולחים ללקוח את הכתובת.

**לשים לב:** הנתונים של כל הלקוחות יושבים בחשבון של הבעלים, כך שכדאי סעיף פרטיות בחוזה איתם. המכסה החינמית של Firebase משותפת לכולם. ב-GitHub Pages בחינם ה-repository ציבורי; חלופה פרטית היא Cloudflare Pages.

## הערות עבודה ל-Claude
- `create_repository` מחזיר 403. **המשתמש יוצר repositories בעצמו**, ואז קוראים ל-`add_repo` עם `push`.
- Force push נחסם. אחרי מיזוג PR: `git fetch origin main && git checkout -B <branch> FETCH_HEAD`, ואחרי ה-commit: `git fetch origin <branch> && git merge -s ours FETCH_HEAD` ואז push.
- עבודה דרך PR ו-squash merge (המשתמש אישר לפעול באופן עצמאי).
- הרשת בסביבת הענן חוסמת את cdnjs ואת jsDelivr. לבדיקות: Playwright עם ספריות מ-npm, ו-Firebase מדומה דרך `route`.
- אין גישה לדפדפן או למחשב של המשתמש מהסשן בענן. כשצריך פעולה בממשק של Firebase או GitHub, מבקשים צילום מסך ומדריכים לפיו.
