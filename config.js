/* ============================================================
   CHECK · הגדרות המערכת — זה הקובץ היחיד שצריך לערוך
   ============================================================

   adminEmail  — חשבון הגוגל היחיד שמורשה להיכנס למסך יצירת ההצעות
                 וללוח הבקרה. כל חשבון אחר ינותק אוטומטית.

   business    — הפרטים שמופיעים ללקוח: בהצעה, בחוזה, ב-PDF וביומן.
                 email הוא גם הכתובת שאליה נשלח כל הסכם חתום.

   firebase    — מסד הנתונים של לוח הבקרה. יוצרים פרויקט חינמי ב-
                 https://console.firebase.google.com (מחוברים עם
                 arielkahalani1@gmail.com), מוסיפים "Web app",
                 ומדביקים כאן את 6 הערכים שמתקבלים. ההוראות המלאות
                 נמצאות בקובץ README.md.                                   */

window.CHECK_CONFIG = {
    adminEmail: 'arielkahalani1@gmail.com',

    business: {
        name:    'CHECK',
        tagline: 'DJ · Live Music · Events',
        email:   'arielkahalani1@gmail.com',
        phone:   ''          // לדוגמה '050-0000000' — יופיע בתחתית ההצעה וב-PDF
    },

    firebase: {
        apiKey:            '',
        authDomain:        '',
        projectId:         '',
        storageBucket:     '',
        messagingSenderId: '',
        appId:             ''
    }
};
