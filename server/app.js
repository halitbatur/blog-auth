const express = require('express');
const partials = require('express-partials');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const authRouter = require('./routes/auth');
const methodOverride = require('method-override');
const { DB_URI } = require('./config');
const app = express();

mongoose.connect(DB_URI).catch((err) => console.log(err));

app.use(partials());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });
  res.render('articles/index', { articles: articles });
});

app.use('/articles', articleRouter);
app.use('/user', authRouter);

// Avatar upload and fetch
app.use(fileUpload({ createParentPath: true }));
app.post('/avatar', function (req, res) {
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
  uploadPath = `${__dirname}/../__cache/${name}`;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.json({ success: true, url: `/avatar/${name}` });
  });
});

app.get('/avatar/:file', (req, res) => {
  let path = `${__dirname}/../__cache/${req.params.file}`;
  let exists = fs.existsSync(path);
  if (exists) {
    fs.createReadStream(path).pipe(res);
  } else res.status(404).send('not found');
});

const PORT = process.env.SERVER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
