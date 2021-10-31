const express = require('express');
const partials = require('express-partials');
const fileUpload = require('express-fileupload');
const path = require('path');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const authRouter = require('./routes/auth');
const avatarRouter = require('./routes/avatar');
const methodOverride = require('method-override');
const db = require('./db');

const app = express();

const isTest = process.env.isJest || process.env.NODE_ENV === 'test';

db.connect().then((msg) => console.log(msg));

// Set view engine and views dir
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const middleware = [
  partials(), // allows layouts
  express.static(path.join(__dirname, 'public')), // serve static paths in /public
  express.urlencoded({ extended: false }), // parses urlencoded forms
  methodOverride('_method'), // adds other rest http methods
  fileUpload({ createParentPath: true }), // parses file posts (uploads)
  attachUser, // adds user to each response template
];

function attachUser(req, res, next) {
  res.locals.user = req.user;
  next();
}

middleware.forEach((item) => {
  // in order
  app.use(item);
});

// == ROUTES ==
// Home page
app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });
  res.render('articles/index', { articles: articles });
});

// /user
app.use('/user', authRouter);

// /articles
app.use('/articles', articleRouter);

// /avatar
app.use(avatarRouter);

// Serve
const PORT = process.env.SERVER_PORT || 8080;
!isTest &&
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });

module.exports = app;
