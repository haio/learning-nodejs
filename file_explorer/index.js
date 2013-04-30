var fs = require('fs');

/*sync*/
console.log(fs.readdirSync(__dirname));

/*async*/
fs.readdir(__dirname, function(err, files) {
  console.log(files);
});