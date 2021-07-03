import authMiddleware from '../../middleware/authMiddleware';

const handler = (req, res) => {
  authMiddleware(req)
    .then(() => {
      res.status(200).json({ message: 'Authorized' });
    })
    .catch(() => {
      res.status(401).json({ message: 'Unauthorized' });
    });
};

export default handler;
