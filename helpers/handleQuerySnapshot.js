const handleQuerySnapshot = (querySnapshot, res) => {
  const promises = [];
  querySnapshot.forEach((doc) => {
    promises.push(
      new Promise((resolve) => {
        const data = doc.data();
        // GET REF
        data.author.get().then(async (authorRef) => {
          const authorRefData = await authorRef.data();
          const newData = {
            id: doc.id,
            data: {
              ...data,
              authorName: authorRefData.displayName,
              authorPicture: authorRefData.photoURL,
            },
          };
          delete newData.author;
          resolve(newData);
        });
      })
    );
  });

  Promise.all(promises).then((results) => {
    if (!results.length) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.status(200).json({ message: 'Success', results });
    }
  });
};

export default handleQuerySnapshot;
