const fs = require('fs');
const mongoose = require('mongoose');
const User = require('./models/user');
const UserLogin = require('./models/userLogin');

mongoose.connect('mongodb://localhost:27017/chatserver')
.then(async () => {
  console.log('MongoDB connected...');

  // Migrate extendedusers.json
  const userData = JSON.parse(fs.readFileSync('./data/extendedusers.json', 'utf-8'));
  for (const user of userData) {
    await User.create(user);
  }
  console.log('User data migrated to MongoDB');

  // Migrate users.json
  const loginData = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
  for (const user of loginData) {
    await UserLogin.create(user);
  }
  console.log('User login data migrated to MongoDB');

  mongoose.disconnect();
})
.catch(err => console.log(err));
