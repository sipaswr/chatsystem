var fs = require('fs');

module.exports = function(req, res) {
  var u = req.body.username;
  var p = req.body.password;
  c = u + p;
  console.log(c);

  fs.readFile('./data/users.json', 'utf8', function(err,data) {
    if (err) throw err;

    let userArray = JSON.parse(data);
    console.log(userArray);

    let i = userArray.findIndex(user =>
      [(user.username == u) && (user.password == p)]);

    if (i == -1) {
      res.send({
        "ok": false
      });
    } else {
        fs.readFile('./data/exendedUsers.json', 'utf8', function(err, data) {
          if (err) throw err;
          let extendedUserArray = JSON.parse(data);

          let i = extendedUserArray.findIndex(user =>
            ((user.username == u)));

          let userData = extendedUserArray[i];
          userData["ok"] = true;
          console.log(userData);
          res.send(userData);
        })
    }
  })
}