const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_ADMIN_FIREBASE_PROJECT_ID,
            clientEmail: process.env.NEXT_ADMIN_FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.NEXT_ADMIN_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.NEXT_FIREBASE_DATABASE_URL,
    });
}

const db = admin.firestore();
module.exports = { db }
