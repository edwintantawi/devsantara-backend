import Cors from 'cors';
import initMiddleware from '../../../middleware/init-middleware';
import initFirebaseAdmin from '../../../helpers/init-firebase-admin';
import authMiddleware from '../../../middleware/authMiddleware';

const admin = initFirebaseAdmin();

const cors = initMiddleware(
  Cors({
    origin: ['https://devsantara.vercel.app', 'http://localhost:3000'],
    methods: ['POST'],
  })
);

const handler = async (req, res) => {
  await cors(req, res);

  authMiddleware(req)
    .then((user) => {
      admin
        .firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const result = { uid: doc.id, ...doc.data() };
            res.status(200).json({ message: 'success', result });
          } else {
            const data = {
              displayName: user.name,
              photoURL: user.picture,
              email: user.email,
              joinAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            admin
              .firestore()
              .collection('users')
              .doc(user.uid)
              .set(data)
              .then((writeResult) => {
                const result = { ...data, joinAt: writeResult._writeTime };
                res.status(201).json({ message: 'success', result });
              });
          }
        });
    })
    .catch(() => res.status(401).json({ message: 'unauthorized' }));
};

export default handler;
