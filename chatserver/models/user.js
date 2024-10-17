const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  username: { type: String, required: true },
  useremail: { type: String, required: true },
  userrole: [{ type: String }],
  usergroups: [{ type: String }]
});

// Create User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
