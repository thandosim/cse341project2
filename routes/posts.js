const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const {
  validateDate,
  validatePostId,
  postRules,
  validate
} = require('../middleware/validatePost');
const {validateUserId} = require('../middleware/validateInput')
const { handleErrors } = require('../middleware/errorHandler');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all posts
router.get('/', handleErrors(postsController.getAllPosts));

// GET posts by specific user
router.get('/user/:userId', validateUserId, handleErrors(postsController.getPostsByUser));

// GET posts after specific date
router.get('/after/:date', validateDate, handleErrors(postsController.getPostsAfterDate));

// POST create a new post (userId comes from req.body and is validated via postRules)
router.post('/', postRules, validate, postsController.createPost);

// PUT update a post by ID
router.put('/:id', validatePostId, postRules, validate, isAuthenticated, postsController.updatePost);

// DELETE a post by ID
router.delete('/:id', validatePostId, isAuthenticated, handleErrors(postsController.deletePost));

module.exports = router;
