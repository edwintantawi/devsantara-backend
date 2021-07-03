import Cors from 'cors';
import initMiddleware from '../../../middleware/init-middleware';
import authMiddleware from '../../../middleware/authMiddleware';
import handleQuerySnapshot from '../../../helpers/handleQuerySnapshot';
import initFirebaseAdmin from '../../../helpers/init-firebase-admin';

const admin = initFirebaseAdmin();

const cors = initMiddleware(
  Cors({
    origin: ['https://devsantara.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT'],
  })
);

const handler = async (req, res) => {
  await cors(req, res);
  const { method, body } = req;
  const bodyJson = JSON.parse(body || '{}');

  if (method === 'POST') {
    authMiddleware(req)
      .then((user) => {
        const blogPostData = {
          authorPicture: user.picture,
          authorName: user.name,
          authorUid: user.uid,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          title: bodyJson.title,
          tags: bodyJson.tags
            .split(',')
            .map((tag, index) => ({ id: index, title: tag.trim() })),
          keywords: bodyJson.title.split(' '),
          visitors: 0,
          likes: [],
          postJson: bodyJson.postJson,
        };
        admin
          .firestore()
          .collection('blog_posts')
          .add(blogPostData)
          .then(({ id }) => {
            res
              .status(201)
              .json({ message: 'Post success', url: `/blogposts/${id}` });
          });
      })
      .catch(() => res.status(401).json({ message: 'Unauthorized' }));
  }

  // if (method === 'PUT') {
  //   authMiddleware(req)
  //     .then(() => {
  //       const blogPostData = {
  //         ...bodyJson,
  //         timestamp: new admin.firestore.Timestamp(
  //           bodyJson.timestamp._seconds,
  //           bodyJson.timestamp._nanoseconds
  //         ),
  //         lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
  //         tags: bodyJson.tags
  //           .split(',')
  //           .map((tag, index) => ({ id: index, title: tag.trim() })),
  //         keywords: bodyJson.title.split(' '),
  //         postJson: bodyJson.postJson,
  //       };
  //       admin
  //         .firestore()
  //         .collection('blog_posts')
  //         .doc(bodyJson.id)
  //         .update(blogPostData)
  //         .then(() => {
  //           res.status(201).json({
  //             message: 'Post success',
  //             url: `/blogposts/${bodyJson.id}`,
  //           });
  //         });
  //     })
  //     .catch(() => res.status(401).json({ message: 'Unauthorized' }));
  // }

  if (method === 'GET') {
    const { uid, popular, latest } = req.query;

    if (!latest && !uid && !latest) {
      admin
        .firestore()
        .collection('blog_posts')
        .orderBy('timestamp', 'desc')
        .get()
        .then((querySnapshot) => {
          handleQuerySnapshot(querySnapshot, res);
        })
        .catch(() => {
          res.status(404).json({ message: 'Not found (no params)' });
        });
    } else if (!!latest && !!uid) {
      admin
        .firestore()
        .collection('blog_posts')
        .where('authorUid', '==', uid)
        .limit(3)
        .orderBy('timestamp', 'desc')
        .get()
        .then((querySnapshot) => {
          handleQuerySnapshot(querySnapshot, res);
        })
        .catch(() => {
          res.status(404).json({ message: 'Not found (latest)' });
        });
    } else if (!!popular && !!uid) {
      admin
        .firestore()
        .collection('blog_posts')
        .where('authorUid', '==', uid)
        .limit(3)
        .orderBy('visitors', 'desc')
        .get()
        .then((querySnapshot) => {
          handleQuerySnapshot(querySnapshot, res);
        })
        .catch(() => {
          res.status(404).json({ message: 'Not found (popular)' });
        });
    } else if (uid) {
      admin
        .firestore()
        .collection('blog_posts')
        .where('authorUid', '==', uid)
        .orderBy('timestamp', 'desc')
        .get()
        .then((querySnapshot) => {
          handleQuerySnapshot(querySnapshot, res);
        })
        .catch(() => {
          res.status(404).json({ message: 'Not found (uid)' });
        });
    }
  }
};

export default handler;
