var express = require('express')
    , sio = require('socket.io')
		, request = require('superagent');

/*create app*/
var app = express.createServer(express.bodyParser(), express.static('public'));
app.listen(3000);

var io = sio.listen(app)
		, apiKey = 'bb1814da2a9119fa5197b5e616750fd7'
    , currentSong
    , dj;

function elect(socket) {
  dj = socket;
  io.sockets.emit('announcement', socket.name + ' is the new DJ');
  socket.emit('elected');
  socket.dj = true;
  socket.on('disconnect', function () {
    dj = null;
    io.sockets.emit('announcement', 'the dj left, next one to join become the dj');
  });
}

io.on('connection', function (socket) {
  console.log('someone connected');

  socket.on('join', function (name) {
    socket.name = name;
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
