/*module dependency*/
var connect  = require('connect')
    , fs= require('fs')
    , time = require('./request-time');

/*create server*/
server = connect.createServer();

server.use(connect.bodyParser());
server.use(connect.static(__dirname + '/website'));

server.use(function (req, res, next) {
  console.log(req.method + ' : ' + req.url);
  next();
});

server.use(connect.logger('type is :res[content-type], length is '
  + ':res[content-length] and it took :response-time ms.'));

server.use(time({time: 500}));

//fast request
server.use(function (req, res, next) {
  if (req.url == '/fast') {
    res.writeHead(200);
    res.end('fast');
  } else {
    next();
  }
});

//slow request
server.use(function (req, res, next) {
  if (req.url == '/slow') {
    setTimeout(function () {
      res.writeHead(200);
      res.end('slow');
    }, 1000);
  } else {
    next();
  }
});

//upload
server.use(function (req, res, next) {
  if (req.url == '/upload' && req.method == 'POST' && req.files.file) {
    fs.readFile(req.files.file.path, 'utf-8', function (err, data) {
      if (err) {
        res.writeHead(100);
        res.end('ERROR');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end([
          '<h3>File: ' + req.files.file.name + '</h3>'
        , '<h4>Type: ' + req.files.file.type + '</h4>'
        , '<h4>Contents:</h4><pre>' + data + '</pre>'
      ].join(''));
    });
  } else {
    next();
  }
});
server.listen(3000);
