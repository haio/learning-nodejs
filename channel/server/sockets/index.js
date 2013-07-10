'use strict';
/*
  Configure socket.io
*/
var server = require('../server')
    , io = server.io
    , sessionStore = server.sessionStore
    , cookieParser = server.cookieParser
    , redis = require('redis');
io.configure(function () {
    io.set('transports', [ 'websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling' ]);
    //Socket.io log level, default 3
    io.set('log level', 1);
    io.enable('browser client gzip');
});
/*
    Use SessionSockets to exchange user data between sockets and http sessions
*/
var SessionSockets = require('session.socket.io');
var sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
/*
 Create two redis connections. A 'pub' for publishing and a 'sub' for subscribing.
 Subscribe 'sub' connection to 'chat' channel.
 */
var sub = redis.createClient();
var pub = redis.createClient();
sub.subscribe('chat');
sub.subscribe('join');
sessionSockets.on('connection', function (err, socket, session) {
    if(!session.user) return;
    socket.on('chat', function (data) {
        var msg = JSON.parse(data);
        var reply = JSON.stringify({action:'message', user:session.user, msg:msg.msg });
        pub.publish('chat', reply);
    });

    socket.on('join', function () {
        var reply = JSON.stringify({action:'control', user:session.user, msg:' joined the channel' });
        pub.publish('join', reply);
    });
    /*
     Use Redis' 'sub' (subscriber) client to listen to any message from Redis to server.
     When a message arrives, send it back to browser using socket.io
    */
    sub.on('message', function (action, message) {
        console.log('*****', action);
		if (action === 'join') {
            console.log(action, 'join');
            socket.broadcast.emit('chat', message);
        } else {
            console.log(action, 'chat')
            socket.emit('chat', message);
        } 
    });
});
