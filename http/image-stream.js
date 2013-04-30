require('http').createServer(function (req, res) {
  console.log(req.headers);
  res.writeHead(200, { 'Content-Type' : 'image/png' });
  
  // stream = require('fs').createReadStream(process.cwd() + '/' + 'github.png');
  // stream.on('data', function (data) {
  //   res.write(data);
  // });
  // stream.on('end', function () {
  //   res.end();
  // });
stream = require('fs').createReadStream(process.cwd() + '/' + 'github.png').pipe(res);
}).listen(3000);