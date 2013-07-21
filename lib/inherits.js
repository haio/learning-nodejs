var util = require('util')
  , EventEmitter = require('events').EventEmitter;

var MyStream = function () {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function (data) {
  this.emit('data', data);
}

/*
  Test
*/
var stream = new MyStream();

console.log(stream instanceof EventEmitter);
console.log(MyStream.super_ === EventEmitter);

stream.on('data', function (data) {
  console.log('Recieve', data);
});
stream.write('Hi world!');

