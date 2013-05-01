var request = require('superagent');

module.exports = function search(q, fn) {
  request.get('http://search.twitter.com/search.json')
              .query( {q: q} )
              .end(function (res) {
                console.log(res.body);
                if (res.body && Array.isArray(res.body.results)) {
                  fn(null, res.body.results);
                }
                fn(new Error('Bad twitter response'));
              });
}