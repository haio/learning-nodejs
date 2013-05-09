/*module dependencies*/
var User = require('./model');

var testUsers = {
  "hello@app.com" : { name: 'hello' }
, "hi@app.com" : { name: 'hi' }
, 'dog@app.com' : { name: 'dog' }
, 'cat@app.com' : { name: 'cat' }
}

function createUsers(users, fn) {
  var total = Object.keys(users).length;
  for (var i in users) {
    (function (email, data) {
      var user = new User(email, data);
      user.save(function (err) {
        if (err) throw err;
        --total || fn();
      });
    })(i, users[i]);
  }
}

createUsers(testUsers, function () {
  console.log(Object.keys(testUsers).length + " users created");
  process.exit();
});