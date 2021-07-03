import admin from 'firebase-admin';

const initFirebaseAdmin = () => {
  const firebaseCredential = JSON.parse(
    process.env.NEXT_PUBLIC_FIREBASE_CREDENTIAL
  );

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseCredential),
    });
  }

  return admin;
};

export default initFirebaseAdmin;
