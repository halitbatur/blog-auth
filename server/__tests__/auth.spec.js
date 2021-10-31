const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = require('../db');

afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

process.env.isJest = true;
const app = require('../app');

// to test login
const correctUser = {
  username: 'madeline.mayer',
  password: 'N0nSt0P',
};

const incorrectUser1 = {
  username: 'mdeli.maye',
  password: 'N0nSt0P',
};

const incorrectUser2 = {
  username: 'madeline.mayer',
  password: 'N0nStP',
};

// to test registration
const newUser = {
  username: 'sarah.ali',
  firstname: 'Sarah',
  lastname: 'Ali',
  password: 'testPassword',
  password2: 'testPassword',
  avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  acceptTos: 'on',
};

function objToUrlEncoded(obj) {
  const keys = Object.keys(obj);
  const values = Object.values(obj);
  const parts = keys.map((key, i) => `${key}=${values[i]}`);

  return parts.join('&');
}

describe('Signin tasks implemented', () => {
  test('responds to get /user/signin', async () => {
    const res = await request(app).get('/user/signin');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  test('logs in user successfully', async () => {
    const res = await request(app)
      .post('/user/signin')
      .send(objToUrlEncoded(correctUser));
    expect(res.statusCode).toBe(302);
    expect(res.header['location']).toBe('/user/authenticated');
    expect(res.header['user']).toBe('6179ddb959261eb8c736c58d');
  });

  test('handles wrong username', async () => {
    const res = await request(app)
      .post('/user/signin')
      .send(objToUrlEncoded(incorrectUser1));
    expect(res.header['location']).toBe(undefined);
    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/wrong username or password/i);
  });

  test('handles wrong password', async () => {
    const res = await request(app)
      .post('/user/signin')
      .send(objToUrlEncoded(incorrectUser2));
    expect(res.header['location']).toBe(undefined);
    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/wrong username or password/i);
  });
});

describe('Signup tasks implemented', () => {
  test('responds to get /user/signup', async () => {
    const res = await request(app).get('/user/signup');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  test('registers a new user successfully', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send(objToUrlEncoded(newUser));
    expect(res.statusCode).toBe(302);
    expect(res.header['location']).toBe('/user/authenticated');

    const user = await mongoose.connection
      .collection('users')
      .find({ username: newUser.username });
    expect(user).toBeDefined();
    expect(user.username).toEqual(newUser.username);
  });

  test('hashes password with bcrypt', async () => {
    await request(app).post('/user/signup').send(objToUrlEncoded(newUser));
    const user = await mongoose.connection
      .collection('users')
      .find({ username: newUser.username });
    expect(user).toBeDefined();
    const valid = await bcrypt.compare(newUser.password, user.password_hash);
    expect(valid).toBe(true);
  });

  test('handles used username', async () => {
    const newUserLocal = Object.assign({}, newUser);
    newUserLocal.username = 'madeline.mayer';
    const res = await request(app)
      .post('/user/signup')
      .send(objToUrlEncoded(newUserLocal));
    expect(res.header['location']).toBe(undefined);
    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/username already used/i);
  });

  test('handles wrong password confirm', async () => {
    const newUserLocal = Object.assign({}, newUser);
    newUserLocal.password2 = '31dmsk';
    const res = await request(app)
      .post('/user/signup')
      .send(objToUrlEncoded(newUserLocal));
    expect(res.header['location']).toBe(undefined);
    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/passwords don't match/i);
  });
});
