const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();

// get an avatar
router.get('/avatar/:file', (req, res) => {
  let path = `${__dirname}/../../__cache/${req.params.file}`;
  let exists = fs.existsSync(path);
  if (exists) {
    fs.createReadStream(path).pipe(res);
  } else res.status(404).send('not found');
});

// upload an avatar
router.post('/avatar', function (req, res) {
  let sampleFile, uploadPath, ext;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.file;
  if (!sampleFile.mimetype.startsWith('image/')) {
    return res.status(401).send('Wrong file type. Only images are accepted');
  } else if (sampleFile.size > 550 * 1024) {
    return res.status(401).send('File is too big. Max size is 550 kb');
  }

  ext = `.${sampleFile.name.split('.').pop()}`;

  let name = crypto.randomUUID() + ext;
  uploadPath = `${__dirname}/../../__cache/${name}`;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.json({ success: true, url: `/avatar/${name}` });
  });
});

module.exports = router;
