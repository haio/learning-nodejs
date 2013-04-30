var fs = require('fs');

var files = fs.readdirSync(process.cwd());

files.forEach(function (file) {
  if (/test/.test(file)) {
    fs.watchFile(process.cwd() + '/' + file, function () {
      console.log("test.txt changed!");
    });
  }
});