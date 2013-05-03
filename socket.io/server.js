var express = require('express')
    , sio = require('socket.io');

/*create app*/
var app = express.createServer(express.bodyParser(), express.static('public'));
app.listen(3000);

var io = sio.listen(app)
    , currentSong
    , dj;
io.on('connection', function (socket) {
  console.log('someone connected');

  socket.on('join', function (name) {
    socket.name = name;
    socket.broadcast.emit('announcement', name + ' join in the chat');
  });

  socket.on('text', function (msg, fn) {
    socket.broadcast.emit('text', socket.name, msg);
    fn(Date.now());
  });
});