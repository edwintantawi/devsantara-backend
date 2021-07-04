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

  admin
    .firestore()
    .collection('posts')
    .where('authorUid', '==', uid)
    .orderBy('visitors', 'desc')
    .limit(3)
    .get()
    .then((querySnapshot) => {
      handleQuerySnapshot(querySnapshot, res);
    })
    .catch(() => {
      res.status(404).json({ message: 'posts not found' });
    });
};

export default handler;
