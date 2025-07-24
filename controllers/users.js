const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const getAllUsers = async (req, res, next) => {
  try {
    const db = getDb();
    // const users = await getDb().db().collection('users').find().toArray();
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.params.userId;

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const db = getDb();
    const { firstName, lastName, type, gender, birthday, favoriteColor } = req.body;

    const result = await db.collection('users').insertOne({
      firstName,
      lastName,
      type,
      gender,
      birthday: new Date(birthday),
      favoriteColor
    });

    res.status(201).json({ message: 'User created', userId: result.insertedId });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.params.userId;
    const { firstName, lastName, type, gender, birthday, favoriteColor } = req.body;

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          firstName,
          lastName,
          type,
          gender,
          birthday: new Date(birthday),
          favoriteColor
        }
      }
    );

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.params.userId;

    const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
