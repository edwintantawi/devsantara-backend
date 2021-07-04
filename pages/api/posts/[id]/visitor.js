import Cors from 'cors';
import initMiddleware from '../../../../middleware/init-middleware';
import initFirebaseAdmin from '../../../../helpers/init-firebase-admin';

const admin = initFirebaseAdmin();

const cors = initMiddleware(
  Cors({
    origin: ['https://devsantara.vercel.app', 'http://localhost:3000'],
    methods: ['PUT'],
  })
);

// INCREMENT VISITOR
const handler = async (req, res) => {
  await cors(req, res);
  const { id } = req.query;

  admin
    .firestore()
    .collection('posts')
    .doc(id)
    .update({
      visitors: admin.firestore.FieldValue.increment(1),
    })
    .then(() => {
      res.status(200).json({ message: 'success' });
    })
    .catch(() => {
      res.status(501).json({ message: 'fail' });
    });
};

export default handler;
