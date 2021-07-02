import admin from 'firebase-admin';
import Cors from 'cors';
import initMiddleware from '../../../middleware/init-middleware';

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
    methods: ['GET', 'POST', 'PUT'],
  })
);

const handler = async (req, res) => {
  await cors(req, res);
  const { id } = req.query;
  const { method } = req;

  if (method === 'PUT') {
    admin
      .firestore()
      .collection('blog_posts')
      .doc(id)
      .update({
        visitors: admin.firestore.FieldValue.increment(1),
      })
      .then(() => {
        res.status(200).json({ message: 'Success' });
      })
      .catch(() => {
        res.status(501).json({ message: 'Fail' });
      });
  }

  admin
    .firestore()
    .collection('blog_posts')
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        res
          .status(200)
          .json({ message: 'Success', result: { id: doc.id, ...doc.data() } });
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    });
};

export default handler;
