import admin from 'firebase-admin';

const authMiddleware = (req) => {
  const { token } = req.headers;
  return new Promise((resolve, reject) => {
    if (token) {
      admin
        .auth()
        .verifyIdToken(token)
        .then((user) => {
          resolve(user);
        })
        .catch(() => reject());
    } else {
      reject();
    }
  });
};

export default authMiddleware;
