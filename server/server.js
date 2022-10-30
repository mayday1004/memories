const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

mongoose
  .connect(config.DATABASE_URL)
  .then(() => console.log('DB connection successful! 😎'))
  .catch(err => console.log(err, 'DB connection failed! 😭'));

mongoose.set('strictQuery', false);

const port = config.PORT;
app.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});
