import authMiddleware from '../../middleware/authMiddleware';

const handler = (req, res) => {
  authMiddleware(req)
    .then(() => {
      res.status(200).json({ message: 'authorized' });
    })
    .catch(() => {
      res.status(401).json({ message: 'unauthorized' });
    });
};

export default handler;
