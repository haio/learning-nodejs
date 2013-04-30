var fs = require('fs');

var stream = fs.createReadStream(__dirname + '/' + 'test.txt');
stream.on('data', function (chunk) {
  console.log(chunk);
});

stream.on('end', function (chunk) {
  console.log(chunk);
  console.log('end');
});