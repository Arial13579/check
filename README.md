# CHECK · הצעות מחיר וחוזים ל-DJ ולמוזיקאים

מערכת להפקת הצעות מחיר והסכמים דיגיטליים להופעות — DJ, נגנים, זמרים ולהקות.
יוצרים הצעה, שולחים ללקוח קישור בוואטסאפ, הלקוח רואה את כל הפרטים, חותם באצבע,
מקבל PDF חתום — ואתם מקבלים עותק למייל ומעקב בלוח בקרה.

**כתובת:** https://arial13579.github.io/check/

| קובץ | מה יש בו |
|---|---|
| `config.js` | **שם העסק, מייל, טלפון, מנהל המערכת ו-Firebase** — הקובץ הראשון לערוך |
| `pricing.js` | **המחירון**: הרכבים, מחירי בסיס, שעות, תוספות, מה כלול ותנאי ההסכם |
| `index.html` | מחולל ההצעות (למנהל) + דף ההצעה והחתימה (ללקוח) |
| `dashboard.html` | לוח בקרה: כל ההצעות, סטטוס חתימה, הכנסות, קבצים חתומים |
| `firestore.rules` | כללי האבטחה של מסד הנתונים |

## הגדרה חד-פעמית (כ-10 דקות)

### 1. GitHub Pages
Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save.

### 2. Firebase (חינמי)
מחוברים ל-<https://console.firebase.google.com> עם **arielkahalani1@gmail.com**:
1. **Add project** → שם כלשהו (למשל `check-quotes`) → אפשר לכבות Google Analytics → Create.
2. **Build → Authentication → Get started → Sign-in method → Google → Enable** → Save.
3. **Authentication → Settings → Authorized domains → Add domain** → `arial13579.github.io`
4. **Build → Firestore Database → Create database** → מיקום `eur3` (או הקרוב) → Production mode.
5. **Firestore → Rules** → מדביקים את כל התוכן של `firestore.rules` → **Publish**.
6. ⚙️ **Project settings → General → Your apps → `</>` (Web)** → שם כלשהו → Register.
   מעתיקים את 6 הערכים מ-`firebaseConfig` אל `config.js` (בתוך `firebase: { ... }`).

### 3. קבלת ההסכמים החתומים למייל
בפעם הראשונה שלקוח חותם, יגיע ל-arielkahalani1@gmail.com מייל מ-**FormSubmit** — לוחצים בו
**Activate Form** פעם אחת. מאותו רגע כל הסכם חתום מגיע למייל עם ה-PDF מצורף.

> רוצים אישור שליחה אמיתי? נרשמים ב-<https://web3forms.com> עם אותו מייל ומדביקים את
> ה-Access Key ב-`WEB3FORMS_KEY` שבתוך `index.html`.

## שימוש
1. נכנסים ל-https://arial13579.github.io/check/ → **התחברות עם Google** (פעם אחת בלבד).
2. ממלאים את פרטי האירוע ובוחרים הרכב — המחיר מחושב אוטומטית (ואפשר לשנות).
3. **צור קישור ללקוח** → **שלח בוואטסאפ**.
4. הלקוח חותם → ה-PDF יורד אצלו, עותק מגיע אליכם למייל, והסטטוס בלוח הבקרה מתעדכן ל"נחתם".
