var net = require('net');

var count  = 0
      users = {};

var server = net.createServer(function (conn) {
  console.log('\033[95m   new connection! \033[39m');
  conn.setEncoding('utf-8');
  conn.write(
    '\n> welcome to \033[92m Tcp-Chat \033[39m' +
    '\n> ' + count + ' other people are connected at this time' +
    '\n> please input your name and press enter to continue: '
    );
  count ++;

  var nickname;

  function broadcast (msg, exceptMyself) {
    for (var i in users) {
      if (!exceptMyself || i != nickname) {
        users[i].write(msg);
      }
    }
  }

  conn.on('data', function (data) {
    console.log(data);
    data = data.replace('\r\n', '');

    if (!nickname) {
      if (users[data]) {
        conn.write('\033[93m ' + nickname + ' already exists!, try agin: \033[39m');
      } else {
        nickname = data;
        users[nickname] = conn;
        broadcast('\033[90m ' + nickname + '\033[39m has join the room\n');
      }
    } else {
      broadcast('\033[90m ' + nickname + '\033[39m' + ' say: ' + data + '\n' , true)
    }
  });

  conn.on('close', function () {
    count --;
    delete users[nickname];
    broadcast('\033[90m ' + nickname + '\033[39m' + ' left the room\n' );
  });
}).listen(3000, function () {
  console.log('\033[95m   server is listening on *:3000 \033[39m');
});

