/*module dependencies*/
var redis = require('redis');

/*module exports*/
module.exports = User;

/*redis client*/
var client = redis.createClient();

/*User model*/
function User(id, data) {
  this.id = id;
  this.data = data;
}

User.prototype.save = function (fn) {
  if(!this.id) {
    this.id = String(Math.random()).substr(3);
  }
  client.hmset('user:' + this.id + ':data', this.data, fn);
}

User.prototype.follow = function (user_id, fn) {
  client.multi()
    .sadd('user:' + this.id + ':follows', user_id)
    .sadd('user:' + user_id + ':followers', this.id)
    .exec(fn);
}

User.prototype.unfollow = function (user_id, fn) {
  client.multi()
    .srem('user:' + this.id + ':follows', user_id)
    .srem('user:' + user_id + ':followers', this.id)
    .exec(fn);
}

User.prototype.getFollows = function (fn) {
  client.smembers('user:' + this.id + ':follows', fn);
}

User.prototype.getFollowers = function (fn) {
  client.smembers('user:' + this.id + ':followers', fn);
}

User.prototype.getFriends = function (fn) {
  client.sinter('user:' + this.id + ':follows', 'user:' + this.id + ':followers', fn);
}

User.find = function (id, fn) {
  client.hgetall('user:' + id + ':data', function (err, obj) {
    if (err) fn(err);
    fn(null, new User(id, obj));
  });
}