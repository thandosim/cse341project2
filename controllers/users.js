const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await getDb().db().collection('users').find().toArray();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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
    const userId = req.params.id;
    const { firstName, lastName, type, gender, birthday, favoriteColor } = req.body;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

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

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

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
