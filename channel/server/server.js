'user strict';

/*
  Module dependencies
*/

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , redis = require('redis');

var app = express()
    , server = http.Server(app)
    , io = require('socket.io').listen(server)
    , RedisStore = require('connect-redis')(express)
    , redisClient = redis.createClient()
    , sessionStore = new RedisStore({ client: redisClient });

/*
  Configure socket.io
*/
io.configure(function () {
    io.set('transports', [ 'websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling' ]);
    //Socket.io log level, default 3
    io.set('log level', 1);
    io.enable('browser client gzip');
});

/*
  Configure express
*/
app.configure(function () {
    server.set( 'port', process.env.PORT || 3000 );
    server.set( 'views', path.join( __dirname, './../app' ) );
    server.set( 'view engine', 'jade' );
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('channel'));
    //Redis session store
    app.use(express.session({ store: sessionStore, key: 'channel', secret: 'your secret here' }));
    app.use(app.router);
    app.use(express.static(path.join( __dirname, './../app' ))));
});

app.get('/', routes.index);

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

/*
 When the user logs in (in our case, does http POST w/ user name), store it
 in Express session (which inturn is stored in Redis)
 */
app.post('/user', function (req, res) {
    req.session.user = req.body.user;
    res.json({"error":""});
});

/*
    Use SessionSockets to exchange user data between sockets and http sessions
*/
var SessionSockets = require('session.socket.io');
var sessionSockets = new SessionSockets(io, sessionStore, cookieParser, 'channel');

/*
 Create two redis connections. A 'pub' for publishing and a 'sub' for subscribing.
 Subscribe 'sub' connection to 'chat' channel.
 */
var sub = redis.createClient();
var pub = redis.createClient();
sub.subscribe('chat');

sessionSockets.on('connection', function (err, socket, session) {
    if(!session.user) return;

    /*
     When the user sends a chat message, publish it to everyone (including myself) using
     Redis' 'pub' client we created earlier.
     Notice that we are getting user's name from session.
     */
    socket.on('chat', function (data) {
        var msg = JSON.parse(data);
        var reply = JSON.stringify({action:'message', user:session.user, msg:msg.msg });
        pub.publish('chat', reply);
    });

    /*
     When a user joins the channel, publish it to everyone (including myself) using
     Redis' 'pub' client we created earlier.
     Notice that we are getting user's name from session.
     */
    socket.on('join', function () {
        var reply = JSON.stringify({action:'control', user:session.user, msg:' joined the channel' });
        pub.publish('chat', reply);
    });

    /*
     Use Redis' 'sub' (subscriber) client to listen to any message from Redis to server.
     When a message arrives, send it back to browser using socket.io
     */
    sub.on('message', function (channel, message) {
        socket.emit(channel, message);
    });

});


server.listen(app.get('port'), function () {
    var serverName = process.env.VCAP_APP_HOST ? process.env.VCAP_APP_HOST + ":" + process.env.VCAP_APP_PORT : 'localhost:3000';
    console.log("Express server listening on " + serverName);
});
