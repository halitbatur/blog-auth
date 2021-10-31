const express = require('express');
const User = require('./../models/user');
const router = express.Router();

// @TODO: Assignment here

router.post('/signin', (req, res) => {
  const { username, password, rememberMe } = req.body;
  // @TODO: Complete user sign in

  res.end(); // this is only to exit tests, change on implementations
});

router.post('/signup', (req, res) => {
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

  res.end(); // this is only to exit tests, change on implementations
});

router.get('/signout', (req, res) => {
  // @TODO: Complete user sign out

  res.end(); // this is only to exit tests, change on implementations
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
