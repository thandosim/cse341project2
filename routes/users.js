const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const { userRules, validate, validateUserId} = require('../middleware/validateInput');
const { handleErrors } = require('../middleware/errorHandler');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all users
router.get('/', handleErrors(usersController.getAllUsers));

// GET single user by ID
router.get('/:userId', validateUserId, handleErrors(usersController.getUserById));

// POST new user
// router.post('/', userRules, validate, handleErrors(usersController.createUser));
router.post('/', userRules, validate, isAuthenticated, usersController.createUser);

// PUT update user
// router.put('/:id', validateUserId, userRules, validate, handleErrors(usersController.updateUser));
router.put('/:userId', validateUserId, userRules, validate, isAuthenticated, usersController.updateUser);

// DELETE user
router.delete('/:userId', validateUserId, isAuthenticated, handleErrors(usersController.deleteUser));

module.exports = router;