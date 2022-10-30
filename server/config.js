const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

exports.NODE_ENV = process.env.NODE_ENV || 'production';
exports.PORT = process.env.PORT || 5000;
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
exports.JWT_SECRET = process.env.JWT_SECRET;
