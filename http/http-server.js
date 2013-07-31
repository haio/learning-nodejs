var http = require('http');

http.createServer(function (req, res) {
  //res.writeHead(200, { 'Content-Type' : 'text/html' });
  //res.write('another thing..');
  //res.end('<h1>Hello Http</h1>');
  res.writeHead(200, { 'Content-type': 'application/json' });
  res.end(JSON.stringify({ name: 'json' }));
}).listen(3000, function () { console.log('server listening port 3000') });
