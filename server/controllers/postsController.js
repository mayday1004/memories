const trycatch = require('../utils/trycatch');
const AppError = require('../utils/AppError');
const Post = require('../models/postModel');

exports.getPosts = trycatch(async (req, res) => {
  const post = await Post.find();

  res.status(200).json(post);
});

exports.createPost = trycatch(async (req, res) => {
  const post = req.body;

  const newPostMessage = new Post({
    ...post,
    creator: req.userId,
  });
  await newPostMessage.save();

  res.status(201).json(newPostMessage);
});

exports.likePost = trycatch(async (req, res) => {
  if (!req.userId) {
    return next(new AppError('Unauthenticated', 404));
  }

  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) next(new AppError('No post found with that ID', 404));

  const index = post.likes.findIndex(id => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter(id => id !== String(req.userId));
  }
  const updatedPost = await post.save();
  res.status(200).json(updatedPost);
});

exports.updatePost = trycatch(async (req, res, next) => {
  const postId = req.params.id;
  const { title, message, tags, selectedFile } = req.body;

  const post = await Post.findById(postId);
  if (!post) next(new AppError('No post found with that ID', 404));

  post.title = title;
  post.message = message;
  post.tags = tags;
  post.selectedFile = selectedFile;
  post.createdAt = new Date().toISOString();

  await post.save();

  res.status(200).json(post);
});

exports.deletePost = trycatch(async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findByIdAndDelete(postId);
  if (!post) next(new AppError('No post found with that ID', 404));

  res.status(200).json({ message: 'Post deleted successfully.' });
});
