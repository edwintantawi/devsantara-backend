import Cors from 'cors';
import initMiddleware from '../../../../middleware/init-middleware';
import initFirebaseAdmin from '../../../../helpers/init-firebase-admin';
import authMiddleware from '../../../../middleware/authMiddleware';

const admin = initFirebaseAdmin();

const cors = initMiddleware(
  Cors({
    origin: ['https://devsantara.vercel.app', 'http://localhost:3000'],
    methods: ['PUT'],
  })
);

// UPDATE LIKE POST
const handler = async (req, res) => {
  await cors(req, res);
  const { id } = req.query;

  authMiddleware(req)
    .then(({ uid }) => {
      admin
        .firestore()
        .collection('posts')
        .doc(id)
        .get()
        .then((doc) => {
          const { likes } = doc.data();
          // check if user already like
          const isLiked = likes.includes(uid);
          const data = {};

          if (isLiked) {
            data.likes = admin.firestore.FieldValue.arrayRemove(uid);
          } else {
            data.likes = admin.firestore.FieldValue.arrayUnion(uid);
          }
          admin
            .firestore()
            .collection('posts')
            .doc(id)
            .update(data)
            .then(() => {
              res.status(200).json({ message: 'success' });
            });
        });
    })
    .catch(() => {
      res.status(401).json({ message: 'unauthorized' });
    });
};

export default handler;
