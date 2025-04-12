import admin from 'firebase-admin';

// 環境変数から秘密鍵のJSON文字列を読み込む
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if(!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };