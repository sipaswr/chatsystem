const mongoose = require('mongoose');

// User Login Schema
const userLoginSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

// Create UserLogin Model
const UserLogin = mongoose.model('UserLogin', userLoginSchema);

module.exports = UserLogin;
