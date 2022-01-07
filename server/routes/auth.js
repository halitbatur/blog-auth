const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('./../models/user');

// Handles sign in request coming from sign in page
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  // User must exist in the database for sign in request
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .render('user/signin', { error: 'Wrong username or password' });
  }

  // Use bcrypt compare to validate the plain text password sent in the request body with the hashed password stored in the database
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    return res
      .status(400)
      .render('user/signin', { error: 'Wrong username or password' });
  }

  // If password is valid, it's a sign in success
  // Return user details and redirect to confirm sign in
  res.setHeader('user', user.id);
  req.user = user;
  res.redirect('/user/authenticated');
});

// Handles sign up request coming from sign up page
router.post('/signup', async (req, res) => {
  const { firstname, lastname, username, password, password2, avatar } =
    req.body;

  // Check password typed correctly by user twice
  if (password !== password2) {
    return res
      .status(400)
      .render('user/signup', { error: 'passwords do not match' });
  }

  // User must not exist in the database for sign up request
  let user = await User.findOne({ username });
  if (user) {
    return res
      .status(400)
      .render('user/signup', { error: `${username}: username already used` });
  }

  // Use bcrypt to hash the user's plain text password with 10 salt rounds
  /* The higher the saltRounds value, the more time the hashing algorithm takes.
  You want to select a number that is high enough to prevent attacks,
  but not slower than potential user patience. We are using the default value, 10.
  */
  const password_hash = await bcrypt.hash(password, 10);

  // Create the user record on the database
  user = await User.create({
    firstname,
    lastname,
    username,
    avatar,
    password_hash,
  });

  // Once user record is created, it's a sign up success
  // Return user details and redirect to confirm sign up
  res.setHeader('user', user.id);
  req.user = user;
  res.redirect('/user/authenticated');
});

// Handles sign out request
router.get('/signout', (req, res) => {
  // Unset user details and simply redirect to home page
  res.setHeader('user', null);
  req.user = null;
  res.redirect('/');
  // Note: This functionality will be built out further in the next assignment, so can be skipped for now
});

// Renders sign up page
router.get('/signup', (req, res) => {
  res.render('user/signup');
});

// Renders sign in page
router.get('/signin', (req, res) => {
  res.render('user/signin');
});

// Renders intermediate page after authentication which auto-redirects to home page after 3 seconds
router.get('/authenticated', (req, res) => {
  res.render('user/authenticated');
});

module.exports = router;

/* NOTE: In this assignment, there is no session handling.
So even after a successful sign in or sign up request,
the app does not render any personalized content for the user or retain their session.
We will explore session management, personalization and setting up authorization guards in the next assignment.
*/

/* NOTE: It is important to use "return" statement for error responses.
This ensures that in case of an error, the function does not continue to execute subsequent lines of code after sending the response.
*/
