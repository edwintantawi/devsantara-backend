import Cors from 'cors';
import initMiddleware from '../../../../middleware/init-middleware';
import initFirebaseAdmin from '../../../../helpers/init-firebase-admin';
import handleQuerySnapshot from '../../../../helpers/handleQuerySnapshot';

const admin = initFirebaseAdmin();

const cors = initMiddleware(
  Cors({
    origin: ['https://devsantara.vercel.app', 'http://localhost:3000'],
    methods: ['GET'],
  })
);

// GET POST BY UID AND ORDER BY VISITORS DESC
const handler = async (req, res) => {
  await cors(req, res);
  const { uid } = req.query;

  const authorRef = admin.firestore().collection('users').doc(uid);

  admin
    .firestore()
    .collection('posts')
    .where('author', '==', authorRef)
    .orderBy('visitors', 'desc')
    .limit(3)
    .get()
    .then((querySnapshot) => {
      handleQuerySnapshot(querySnapshot, res);
    })
    .catch(() => {
      res.status(404).json({ message: 'popular posts not found' });
    });
};

export default handler;
