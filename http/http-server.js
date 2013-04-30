var http = require('http');

module.exports = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type' : 'text/html' });
  res.write('another thing..');
  res.end('<h1>Hello Http</h1>');
});