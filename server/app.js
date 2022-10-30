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

//routes
app.get('/', (req, res) => {
  res.send('Welcome!');
});

app.use('/posts', postsRouter);
app.use('/user', authRouter);

app.get('*', (req, res) => {
  res.status(404).send('404 not found');
});

module.exports = app;
