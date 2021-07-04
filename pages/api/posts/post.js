import Cors from 'cors';
import initMiddleware from '../../../middleware/init-middleware';
import authMiddleware from '../../../middleware/authMiddleware';
import initFirebaseAdmin from '../../../helpers/init-firebase-admin';

const admin = initFirebaseAdmin();

const cors = initMiddleware(
  Cors({
    origin: ['https://devsantara.vercel.app', 'http://localhost:3000'],
    methods: ['POST'],
  })
);

const handler = async (req, res) => {
  await cors(req, res);
  const { body } = req;
  const bodyJson = JSON.parse(body);

  authMiddleware(req)
    .then((user) => {
      const data = {
        authorPicture: user.picture,
        authorName: user.name,
        authorUid: user.uid,
        createAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdateAt: null,
        title: bodyJson.title.trim(),
        tags: bodyJson.tags
          .split(',')
          .map((tag, index) => ({ id: index, title: tag.trim() }))
          .filter((tag) => tag),
        keywords: bodyJson.title.trim().split(' '),
        visitors: 0,
        likes: [],
        content: bodyJson.content,
      };
      admin
        .firestore()
        .collection('posts')
        .add(data)
        .then(({ id }) => {
          res
            .status(201)
            .json({ message: 'post success', url: `/posts/${id}` });
        });
    })
    .catch(() => res.status(401).json({ message: 'unauthorized' }));
};

export default handler;
