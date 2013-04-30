var http = require('http')
    , qs = require('querystring')
    , stdin = process.stdin
    , stdout = process.stdout;

function send (data) {
  http.request({
    host: '127.0.0.1'
   , port: 3000
   , url: '/'
   , method: 'POST'
  } , function (res) {
    var body = '';
    res.setEncoding('utf-8');
    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      console.log('\n  \033[90m✔ request complete!\033[39m');
      stdout.write('\n  your name: ');
    } );
  }).end(qs.stringify({ name: data }));
}

stdout.write('\n  your name: ');
stdin.resume();
stdin.setEncoding('utf-8');
stdin.on('data', function (name) {
  send(name.replace('\n', ''));
});
