import Cors from 'cors';
import initMiddleware from '../../../../middleware/init-middleware';
import initFirebaseAdmin from '../../../../helpers/init-firebase-admin';

const admin = initFirebaseAdmin();

const cors = initMiddleware(
  Cors({
    origin: ['https://devsantara.vercel.app', 'http://localhost:3000'],
    methods: ['GET'],
  })
);

// GET EACH POST BY ID
const handler = async (req, res) => {
  await cors(req, res);
  const { id } = req.query;

  admin
    .firestore()
    .collection('posts')
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        res
          .status(200)
          .json({ message: 'success', result: { id: doc.id, ...doc.data() } });
      } else {
        res.status(404).json({ message: 'post not found' });
      }
    });
};

export default handler;
