var express = require('express')
		, app = express()
		, server = require('http').Server(app)
		, sio = require('socket.io')
		, io = sio.listen(server)
		, request = require('superagent');

/*create app*/
app.use(express.static(__dirname + '/public'));
server.listen(3000);
module.exports = server;

var apiKey = 'bb1814da2a9119fa5197b5e616750fd7'
    , currentSong
    , dj;

function elect(socket) {
  dj = socket;
  io.sockets.emit('announcement', socket.name + ' is the new DJ');
  socket.emit('elected');
  socket.dj = true;
  socket.on('disconnect', function () {
    dj = null;
		console.log( socket.in(socket.name) );
		socket.leave(socket.name);
    io.sockets.emit('announcement', 'the dj left, next one to join become the dj');
  });
}

io.set('authorization', function (hsData, accept) {
	console.log(hsData);
	console.log('-----------------------');
	return accept(null, true);
});

io.on('connection', function (socket) {
  console.log('someone connected');
  socket.on('join', function (name) {
    socket.name = name;
		socket.join(name, function () { console.log(name + 'join the room') });
    socket.broadcast.emit('announcement', name + ' join in the chat');
    if (!dj) {
      elect(socket);
    } else {
      socket.emit('song', currentSong);
    }
  });

  socket.on('text', function (msg, fn) {
    socket.broadcast.emit('text', socket.name, msg);
    fn(Date.now());
  });

	socket.on('search', function (q, fn) {
		var url = 'http://tinysong.com/s/' + encodeURIComponent(q) + '?key=' + apiKey + '&format=json';
		request(url, function (res) {
			if (200 === res.status) fn(JSON.parse(res.text));
		});
	});

	socket.on('song', function (song) {
		if (socket.dj) {
			currentSong = song;
			socket.broadcast.emit('song', song);
		}	
	});
});
