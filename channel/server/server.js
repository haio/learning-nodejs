'user strict';

/*
  Module dependencies
*/
var express = require('express')
    , http = require('http')
    , path = require('path')
    , redis = require('redis');

var app = exports.app =  express()
    , server = http.createServer(app)
    , io = exports.io =  require('socket.io').listen(server)
    , RedisStore = require('connect-redis')(express)
    , redisClient = redis.createClient()
    , sessionStore = exports.sessionStore = new RedisStore({ client: redisClient })
    , cookieParser = exports.cookieParser = express.cookieParser('cookie secret');

/*
  Configure express
*/
app.configure(function () {
    app.set( 'port', process.env.PORT || 3000 );
    app.set( 'views', path.join( __dirname, './../app' ) );
    app.set( 'view engine', 'jade' );
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(cookieParser);
    //Redis session store
    app.use(express.session({ store: sessionStore, secret: 'cookie secret' }));
    app.use(app.router);
    app.use(express.static(path.join( __dirname, './../app' )));
});

server.listen(app.get('port'), function () {
    console.log("Express server listening on " + '0.0.0.0:3000');
});

require('./routes');

require('./sockets');
