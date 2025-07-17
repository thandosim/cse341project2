const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { body, validationResult } = require('express-validator');

const userRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('type').isIn(['student', 'teacher', 'admin']).withMessage('Invalid user type'),
  body('gender').isIn(['male', 'female']).withMessage('Invalid gender'),
  body('birthday').isISO8601().toDate().withMessage('Birthday must be a valid date'),
  body('favoriteColor').trim().notEmpty().withMessage('Favorite color is required')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

const validateUserId = async (req, res, next) => {
  const userId = req.params.id;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const db = getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally attach the found user to request object
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userRules,
  validate,
  validateUserId
};
