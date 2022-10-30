const express = require('express');
const postsController = require('../controllers/postsController');
const authController = require('../controllers/authController');
const router = express.Router();

router.route('/').get(postsController.getPosts).post(authController.protect, postsController.createPost);
router.use('/:id', authController.protect);
router.route('/:id/likePost').patch(authController.protect, postsController.likePost);
router.route('/:id').patch(postsController.updatePost).delete(postsController.deletePost);

module.exports = router;
