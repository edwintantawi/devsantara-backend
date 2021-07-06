import Cors from 'cors';
import initMiddleware from '../../../middleware/init-middleware';
import initFirebaseAdmin from '../../../helpers/init-firebase-admin';

const admin = initFirebaseAdmin();

const cors = initMiddleware(
  Cors({
    origin: ['https://devsantara.vercel.app', 'http://localhost:3000'],
    methods: ['GET'],
  })
);

const handler = async (req, res) => {
  await cors(req, res);
  const { uid } = req.query;

  const authorRef = admin.firestore().collection('users').doc(uid);

  admin
    .firestore()
    .collection('posts')
    .where('author', '==', authorRef)
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
