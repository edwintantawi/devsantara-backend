import Cors from 'cors';
import initMiddleware from '../../../middleware/init-middleware';
import handleQuerySnapshot from '../../../helpers/handleQuerySnapshot';
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
  const { uid, lastId } = req.query;

  // IF FROM QUERY HAVE UID, THEN RETURN ALL POST BY UID
  if (uid) {
    const authorRef = admin.firestore().collection('users').doc(uid);

    admin
      .firestore()
      .collection('posts')
      .where('author', '==', authorRef)
      .orderBy('createAt', 'desc')
      .get()
      .then((querySnapshot) => {
        handleQuerySnapshot(querySnapshot, res);
      })
      .catch(() => {
        res.status(404).json({ message: 'posts not found' });
      });
  } else if (lastId) {
    let lastDoc;
    await admin
      .firestore()
      .collection('posts')
      .doc(lastId)
      .get()
      .then((doc) => {
        lastDoc = doc.data().createAt;
      });

    admin
      .firestore()
      .collection('posts')
      .orderBy('createAt', 'desc')
      .limit(10)
      .startAfter(lastDoc)
      .get()
      .then((querySnapshot) => {
        handleQuerySnapshot(querySnapshot, res);
      })
      .catch(() => {
        res.status(404).json({ message: 'posts not found' });
      });
  } else {
    admin
      .firestore()
      .collection('posts')
      .orderBy('createAt', 'desc')
      .limit(10)
      .get()
      .then((querySnapshot) => {
        handleQuerySnapshot(querySnapshot, res);
      })
      .catch(() => {
        res.status(404).json({ message: 'posts not found' });
      });
  }
};

export default handler;
