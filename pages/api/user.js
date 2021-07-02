import admin from 'firebase-admin';
import Cors from 'cors';
import initMiddleware from '../../middleware/init-middleware';

const firebaseCredential = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CREDENTIAL
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseCredential),
  });
}

const cors = initMiddleware(
  Cors({
    origin: ['https://devsantara.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  })
);

const handler = async (req, res) => {
  await cors(req, res);
  const { uid } = req.query;

  admin
    .firestore()
    .collection('blog_posts')
    .where('authorUid', '==', uid)
    .get()
    .then((querySnapshot) => {
      const results = [];

      querySnapshot.forEach((doc) => {
        results.push({ ...doc.data() });
      });

      const posts = results.length;
      const visitors = results.reduce(
        (previousValue, currentValue) => previousValue + currentValue.visitors,
        0
      );

      res.status(200).json({ message: 'Success', result: { posts, visitors } });
    });
};

export default handler;
