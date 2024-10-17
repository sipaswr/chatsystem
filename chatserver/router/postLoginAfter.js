const User = require('../models/user'); // Import User model

module.exports = async function(req, res) {
  const userobj = {
    userid: req.body.userid,
    username: req.body.username,
    userbirthdate: req.body.userbirthdate,
    userage: req.body.userage
  };

  try {
    // Check if user already exists
    let existingUser = await User.findOne({ username: userobj.username });
    
    if (!existingUser) {
      // If user doesn't exist, create new user
      await User.create(userobj);
      console.log('New user added:', userobj);
    } else {
      Object.assign(existingUser, userobj);
      await existingUser.save(); 
      console.log('User updated:', existingUser);
    }

    const allUsers = await User.find(); // Fetch all users after adding/updating
    res.send(allUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
