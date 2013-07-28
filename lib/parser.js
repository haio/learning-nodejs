var parse = require('connection-parse');
var HashRing = require('hashring');
var CH = require('./hashring');

// parse.extension('vnodes', function vnode(data, value) {
//   if (typeof value === 'object' && !Array.isArray(value) && 'vnodes' in value) {
//     data.vnodes = +value.vnodes || 0;
//   } else {
//     data.vnodes = 0;
//   }
// });

// console.log(parse('1.1.1.1:1234'));
// console.log('------------------');
// console.log(parse(['1.1.1.1:1234', '2.2.2.2:1234']));
// console.log('------------------');
// console.log(parse({'1.1.1.1:1234' : 100, '2.2.2.2:1234' : 200}));
// console.log('------------------');
// console.log(parse({'1.1.1.1:1234': { 'vnodes': 100 }, '2.2.2.2:2345': { 'vnodes': 200 }}))

var ips = ['127.0.0.1:11211', '127.0.0.2:11211',
           '127.0.0.3:11211', '127.0.0.4:11211',
           '127.0.0.5:11211', '127.0.0.6:11211' ];

var ring = new HashRing(ips);
var ch = new CH(ips);

var hashValue = require('hashring').hashValue;
console.log(hashValue.hash('zhongyu'));
console.log(hashValue.hash(1,2,4,5));
console.log(hashValue.hash(1,2,4,5));

var crypto = require('crypto');
var hash1 = crypto.createHash('md5').update('1.1.1.1:344-1').digest();
console.log(hash1.split('').length);

console.log(ring.hashValue('1234'));
console.log(ring.hashValue('2345'));

console.log('-----------');
var min = 10000000000, max=0, sum1=0, sum2=0, srvs=[], srvs1=[];
for (var i=0; i < 100000; i++) {
  var v = hashValue.hash(Math.floor( Math.random()*256 ),Math.floor( Math.random()*256 ),
                            Math.floor( Math.random()*256 ),Math.floor( Math.random()*256 ));
  var r = Math.floor( Math.random()*256 );

  var num = Math.floor( Math.random()*100000 )
  srvs.push(ring.get(num+''));
  srvs1.push(ch.get(num+''));
  sum1 += v;
  sum2 += r;

  if (v>max) {
    max = v;
  }

  if (v<min) min = v;
}

console.log('average: ', sum1/100000);
console.log('average: ', sum2/100000);
console.log(max, min);

var result = [0, 0, 0, 0, 0, 0]
var result1 = [0, 0, 0, 0, 0, 0]
srvs.map(function (s) {
  switch (s) {
    case ips[0]:
      result[0] ++;
      break;
    case ips[1]:
      result[1] ++;
      break;
    case ips[2]:
      result[2] ++;
      break;
    case ips[3]:
      result[3] ++;
      break;
    case ips[4]:
      result[4] ++;
      break;
    case ips[5]:
      result[5] ++;
      break;
    // case ips[6]:
    //   result[6] ++;break;
  }
});

srvs1.map(function (s) {
  switch (s) {
    case ips[0]:
      result1[0] ++;
      break;
    case ips[1]:
      result1[1] ++;
      break;
    case ips[2]:
      result1[2] ++;
      break;
    case ips[3]:
      result1[3] ++;
      break;
    case ips[4]:
      result1[4] ++;
      break;
    case ips[5]:
      result1[5] ++;
      break;
    // case ips[6]:
    //   result[6] ++;break;
  }
});

var got = 0;
result.map(function (r) {
  console.log(r, r/100000);
})

console.log('----------------');

result1.map(function (r) {
  got += r;
  console.log(r, r/100000);
})

console.log(got);