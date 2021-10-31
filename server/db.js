const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  TEST_DB_HOST,
  DB_PORT,
  DB_NAME,
  isJest,
} = process.env;

const DB_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
const TEST_DB_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${TEST_DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

let uri = isJest ? TEST_DB_URI : DB_URI;

module.exports = {
  DB_URI,
  TEST_DB_URI,
  connect: async () => {
    await mongoose.connect(uri).catch((err) => console.log(err));
    return isJest ? 'Connected to test db.' : 'Connected to db.';
  },
  closeDatabase: async () => {
    // await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  },

  clearDatabase: async () => {
    const keepIDs = {
      users: ['6179ddb959261eb8c736c58d'],
      articles: [
        '6179dee782ec53cf04018f40',
        '6179e2a8a660ff0c4237207e',
        '6179eec2fa1cb9ff468a799c',
      ],
    };
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({
        _id: { $not: { $in: keepIDs[key].map(ObjectId) } },
      });
    }
  },
};
