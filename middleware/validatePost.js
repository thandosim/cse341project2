const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { body, validationResult } = require('express-validator');

const postRules = [
  body('userId')
    .custom((value) => ObjectId.isValid(value))
    .withMessage('Invalid user ID format'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

const validateDate = (req, res, next) => {
  const dateStr = req.params.date;
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD or ISO format.' });
  }

  req.date = date;
  next();
};


const validatePostId = async (req, res, next) => {
  const postId = req.params.id;

  if (!ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID format' });
  }

  try {
    const db = getDb();
    const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    req.post = post;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postRules,
  validate,
  validateDate,
  validatePostId
};
