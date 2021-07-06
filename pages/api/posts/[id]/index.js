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
        const data = doc.data();

        data.author.get().then((authorRef) => {
          const authorRefData = authorRef.data();
          const dataWithAuthor = {
            ...data,
            authorName: authorRefData.displayName,
            authorPicture: authorRefData.photoURL,
          };

          // remove author properties
          delete dataWithAuthor.author;

          res.status(200).json({
            message: 'success',
            result: { id: doc.id, ...dataWithAuthor },
          });
        });
      } else {
        res.status(404).json({ message: 'post not found' });
      }
    });
};

export default handler;
