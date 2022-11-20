const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');
const postsRouter = require('./routes/postsRouter');
const authRouter = require('./routes/authRouter');

const app = express();

//middleware-global
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(
  cors({
    origin: config.CLIENT_URL,
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

//routesa
app.use('/posts', postsRouter);
app.use('/user', authRouter);

if (config.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html')));
} else {
  app.get('/', (req, res) => {
    res.send('API is running..');
  });
  app.all('*', (req, res) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
  });
}

module.exports = app;
