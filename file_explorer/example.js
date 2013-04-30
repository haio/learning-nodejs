// console.log('hello world');

// process.stdout.write('hello node');
var fs = require('fs'),
      stdout = process.stdout,
      stdin  = process.stdin;

fs.readdir(process.cwd(), function (err, files) {
  console.log('');
  if (!files.length) {
    return console.log('\033[31m No files to show!\033[39m\n');
  }

  console.log('Select file or directory you want to see\n');

  var stats = [];

  function file(i) {
    var filename = files[i];
    fs.stat(__dirname + '/' + filename, function (err, stat) {
      stats[i] = stat;

      if (stat.isDirectory()) {
        console.log(' ' + i + ' ' + '\033[36m ' + filename + '/\033[39m');
      } else {
        console.log(' ' + i + ' ' + '\033[50m ' + filename + '\033[39m');
      }

      if (++i == files.length) {
        read();
      } else {
        file(i);
      }
    });
  }

  function read() {
    console.log('');
    stdout.write('\033[36m Enther your chilce: \033[39m');
    stdin.resume();
    stdin.setEncoding('utf-8');
    stdin.on('data', option);
  }

  function option(data) {
    filename = files[Number(data)]
    if (!filename) {
      stdout.write('\033[31m Enther your chilce: \033[39m');
    } else {
      if (stats[Number(data)].isDirectory()) {
        fs.readdir(__dirname + '/' + filename, function (err, files) {
          console.log('');
          console.log('(' + files.length + 'files)');
          files.forEach(function (file) {
            console.log('- ' + file);
          });
        });
      } else {
        stdin.pause();
        fs.readFile(__dirname + '/' + filename, 'utf-8', function (err, data) {
          console.log('');
          console.log('\033[80m' + data.replace(/(.*)/g, '     $1') + '\033[39m');
        });
      }
    }
  }

  file(0);
});