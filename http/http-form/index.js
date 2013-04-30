var http = require('http'),
      qs = require('querystring');

http.createServer(function (req, res) {
  if ('/' == req.url) {
    res.writeHead(200, { 'Content-Type' : 'text/html' });
    res.end([
      '<form method="post" action="/url">'
    , '<h1>Form</h1>'
    , '<filedset>'
    , '<label>Personal Information</label>'
    , '<p>Your name</p>'
    , '<input type="text" name="name"></input>'
    , '<p><button>Submit</button></p>'
    ].join(''));
  } else if ('/url' == req.url && 'POST' == req.method) {
    var body = '';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      res.writeHead(200, { 'Content-Type' : 'text/html' });
      res.end([
        '<p>Content-Type:' + req.headers['content-type'] + '</p>'
      , '<p>body:'+qs.parse(body).name+'</p>'].join('') );
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
}).listen(3000);