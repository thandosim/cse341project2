const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const { userRules, validate, validateUserId} = require('../middleware/validateInput');

// GET all users
router.get('/', usersController.getAllUsers);

// GET single user by ID
router.get('/:id', validateUserId, usersController.getUserById);

// POST new user
router.post('/', userRules, validate, usersController.createUser);

// PUT update user
router.put('/:id', validateUserId, userRules, validate, usersController.updateUser);

// DELETE user
router.delete('/:id', validateUserId, usersController.deleteUser);

module.exports = router;