const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// Get all posts
const getAllPosts = async (req, res, next) => {
  try {
    const db = getDb();
    const posts = await db.collection('posts').find().toArray();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// Get posts by user ID
const getPostsByUser = async (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.params.userId;

    // if (!ObjectId.isValid(userId)) {
    //   return res.status(400).json({ message: 'Invalid user ID format' });
    // }

    const posts = await db.collection('posts').find({ userId: new ObjectId(userId) }).toArray();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// Get posts after a specific date
const getPostsAfterDate = async (req, res, next) => {
  try {
    const db = getDb();
    const date = new Date(req.params.date);

    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Includes posts created on or after midnight of that date
    const posts = await db
      .collection('posts')
      .find({ createdAt: { $gte: date } })
      .toArray();

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};


// Create a post
const createPost = async (req, res, next) => {
  try {
    const db = getDb();
    const { userId, title, content } = req.body;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const result = await db.collection('posts').insertOne({
      userId: new ObjectId(userId),
      title,
      content,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Post created', postId: result.insertedId });
  } catch (err) {
    next(err);
  }
};

// Update a post
const updatePost = async (req, res, next) => {
  try {
    const db = getDb();
    const postId = req.params.id;
    const { userId, title, content } = req.body;

    // if (!ObjectId.isValid(postId)) {
    //   return res.status(400).json({ message: 'Invalid post ID format' });
    // }

    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { $set: { title, content } }
    );

    // if (result.matchedCount === 0) {
    //   return res.status(404).json({ message: 'Post not found' });
    // }

    res.status(200).json({ message: 'Post updated successfully' });
  } catch (err) {
    next(err);
  }
};

// Delete a post
const deletePost = async (req, res, next) => {
  try {
    const db = getDb();
    const postId = req.params.id;

    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID format' });
    }

    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(postId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPosts,
  getPostsByUser,
  getPostsAfterDate,
  createPost,
  updatePost,
  deletePost
};
