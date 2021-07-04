import Cors from 'cors';
import initMiddleware from '../../../middleware/init-middleware';
import authMiddleware from '../../../middleware/authMiddleware';
import initFirebaseAdmin from '../../../helpers/init-firebase-admin';

const admin = initFirebaseAdmin();

const cors = initMiddleware(
  Cors({
    origin: ['https://devsantara.vercel.app', 'http://localhost:3000'],
    methods: ['PUT'],
  })
);

const handler = async (req, res) => {
  await cors(req, res);
  const { body } = req;
  const bodyJson = JSON.parse(body);

  authMiddleware(req)
    .then(() => {
      const data = {
        ...bodyJson,
        createAt: new admin.firestore.Timestamp(
          bodyJson.createAt._seconds,
          bodyJson.createAt._nanoseconds
        ),
        title: bodyJson.title.trim(),
        lastUpdateAt: admin.firestore.FieldValue.serverTimestamp(),
        tags: bodyJson.tags
          .split(',')
          .map((tag, index) => ({ id: index, title: tag.trim() }))
          .filter((tag) => tag),
        keywords: bodyJson.title.split(' '),
      };
      admin
        .firestore()
        .collection('posts')
        .doc(bodyJson.id)
        .update(data)
        .then(() => {
          res.status(201).json({
            message: 'post update success',
            url: `/posts/${bodyJson.id}`,
          });
        });
    })
    .catch(() => res.status(401).json({ message: 'unauthorized' }));
};

export default handler;
