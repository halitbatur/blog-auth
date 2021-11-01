const express = require('express');
const User = require('./../models/user');
const bcrypt = require('bcrypt');
const router = express.Router();

// @TODO: Assignment here

router.post('/signin', async (req, res) => {
  const { username, password, rememberMe } = req.body;
  // @TODO: Complete user sign in
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .render('user/signin', { error: 'Wrong username or password' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res
      .status(400)
      .render('user/signin', { error: 'Wrong username or password' });
  }

  res.setHeader('user', user.id);
  req.user = user;
  res.redirect('/user/authenticated');
});

router.post('/signup', async (req, res) => {
  const {
    firstname,
    lastname,
    username,
    password,
    password2,
    acceptTos, // either "on" or undefined
    avatar,
  } = req.body;

  // @TODO: Complete user sign up
  // Check password quality
  if (password !== password2) {
    return res
      .status(400)
      .render('user/signup', { error: 'passwords do not match' });
  }
  // Check username is unique
  let user = await User.findOne({ username });
  if (user) {
    return res
      .status(400)
      .render('user/signup', { error: `${username}: username already used` });
  }

  const password_hash = await bcrypt.hash(password, 10);

  user = await User.create({
    firstname,
    lastname,
    username,
    avatar,
    password_hash,
  });

  req.user = user;

  res.redirect('/user/authenticated'); // this is only to exit tests, change on implementations
});

router.get('/signout', (req, res) => {
  // @TODO: Complete user sign out

});

// renders sign up page
router.get('/signup', (req, res) => {
  res.render('user/signup');
});

// renders sign in page
router.get('/signin', (req, res) => {
  res.render('user/signin');
});

router.get('/authenticated', (req, res) => {
  res.render('user/authenticated');
});

module.exports = router;
