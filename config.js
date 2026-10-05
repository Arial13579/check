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
        apiKey:            'AIzaSyC57wmkBOtr7tCF_Uv-LPv6BFCVIcXAyqM',
        authDomain:        'check-b2a66.firebaseapp.com',
        projectId:         'check-b2a66',
        storageBucket:     'check-b2a66.firebasestorage.app',
        messagingSenderId: '928170638673',
        appId:             '1:928170638673:web:878d75caeda5469296e770'
    },

    // שם מסד הנתונים ב-Firestore כפי שנוצר בפרויקט (מסד ברירת המחדל הרגיל נקרא '(default)')
    firestoreDatabaseId: 'default'
};
