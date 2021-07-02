const handleQuerySnapshot = (querySnapshot, res) => {
  const results = [];
  querySnapshot.forEach((doc) => {
    results.push({ id: doc.id, data: doc.data() });
  });

  if (!results.length) {
    res.status(404).json({ message: 'Not found' });
  } else {
    res.status(200).json({ message: 'Success', results });
  }
};

export default handleQuerySnapshot;
