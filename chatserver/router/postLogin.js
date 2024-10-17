const UserLogin = require('../models/userLogin');
const User = require('../models/user'); 

module.exports = async function(req, res) {
  const { username, password } = req.body;
  console.log(username + password);

  try {
    // Check if user exists in users collection
    const userLogin = await UserLogin.findOne({ username, password });
    
    if (!userLogin) {
      return res.send({ ok: false });
    }


    const extendedUser = await User.findOne({ username });

    if (extendedUser) {
      extendedUser.ok = true;
      console.log(extendedUser);
      return res.send(extendedUser);
    }
    
    res.send({ ok: false });
  } catch (err) {
    console.error(err);
    res.status(500).send({ ok: false, message: 'Internal Server Error' });
  }
};