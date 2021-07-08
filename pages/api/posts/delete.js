import Cors from 'cors';
import initMiddleware from '../../../middleware/init-middleware';
import authMiddleware from '../../../middleware/authMiddleware';
import initFirebaseAdmin from '../../../helpers/init-firebase-admin';

const admin = initFirebaseAdmin();

const cors = initMiddleware(
  Cors({
    origin: ['https://devsantara.vercel.app', 'http://localhost:3000'],
    methods: ['DELETE'],
  })
);

const handler = async (req, res) => {
  await cors(req, res);
  const { id } = req.query;

  authMiddleware(req)
    .then(() => {
      admin
        .firestore()
        .collection('posts')
        .doc(id)
        .delete()
        .then(() => {
          res.status(200).json({ message: 'delete post success' });
        });
    })
    .catch(() => res.status(401).json({ message: 'unauthorized' }));
};

export default handler;
