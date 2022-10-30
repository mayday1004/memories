const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const trycatch = require('../utils/trycatch');
const AppError = require('../utils/AppError');
const User = require('../models/userModel');
const config = require('../config');

exports.signup = trycatch(async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) return next(new AppError('User already exists', 400));

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await User.create({
    email,
    password: hashedPassword,
    name: `${firstName} ${lastName}`,
  });

  const token = jwt.sign({ email: result.email, id: result._id }, config.JWT_SECRET, { expiresIn: '1h' });

  res.status(201).json({ result, token });
});

exports.signin = trycatch(async (req, res, next) => {
  const { email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (!oldUser) return next(new AppError('User not exists', 400));

  const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
  if (!isPasswordCorrect) return next(new AppError('invaild email or password', 400));

  const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, config.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ result: oldUser, token });
});

exports.protect = trycatch(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 驗證JWT令牌是否有效
  const isGoogleAuth = token.length > 500; //google登入的>500
  let decoded;
  if (!isGoogleAuth) {
    decoded = await promisify(jwt.verify)(token, config.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('Can not found this AccountID.', 401));
    }
    req.userId = decoded.id;
  } else {
    decoded = jwt.decode(token);
    req.userId = decoded?.sub;
  }

  next();
});
