'use strict';

var net = require('net'),
    redis = require('redis'),
    util = require('util');

var Handler = function () {
    this.processor = new Processor();
}

Handler.prototype.handle = function (data, callback) {
    var args = this.parseCmd(data);
}

Handler.prototype.parseCmd = function (data) {
    
}


var Processor = function () {
    if (!this.client) this.client = redis.createClient();
}

Processor.prototype.doSet = function () {

}

/*
 * Daemon server that hanlde memcache client connections
 */
var Server = function () {
    net.Server.call(this);
    this.handler = new Handler();
    this.on('connection', function (socket) {
        socket.on('data', function (buffer) {
            this.handler.handle(buffer, function (err, reply) {
                socket.write(reply); 
            });
        }.bind(this));
    });
}
util.inherits(Server, net.Server);

module.exports.Server = Server;
module.exports.createServer = function () {
    return new Server();
}
