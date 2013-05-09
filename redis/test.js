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

function hydrate (users, fn) {
  var total = Object.keys(users).length;
  for (var i in users) {
    (function (email, data) {
      User.find(email, function (err, user) {
        if (err) throw err;
        users[email] = user;
        --total || fn();
      });
    })(i, users[i]);
  }
}

/*Too much */
createUsers(testUsers, function () {
  console.log(Object.keys(testUsers).length + " users created");
  hydrate(testUsers, function () {
    testUsers['hello@app.com'].follow('hi@app.com', function (err) {
      if (err) throw err;
      console.log('hello followed hi');
      
      testUsers['hi@app.com'].getFollowers(function (err, users) {
        if (err) throw err;
        console.log("hi's fans: ", users);

        testUsers['hi@app.com'].getFriends(function (err, users) {
          if (err) throw err;
          console.log("hi's friends: ", users);

          testUsers['hi@app.com'].follow('hello@app.com', function (err) {
            if (err) throw err;
            console.log('hi followed hello too');

            testUsers['hi@app.com'].getFriends(function (err, users) {
              if (err) throw err;
              console.log("hi's friends:", users);
              process.exit(0);
            });
          });
        });
      });
    });
  });
});
