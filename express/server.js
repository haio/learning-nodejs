/*module requirements*/
var express = require('express')
    , search = require('./search');

/*create app*/
var app = express.createServer();

/*config app*/
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', { layout: false })

/*routes*/
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/search', function (req, res, next) {
  search(req.query.q, function (err, tweets) {
    if (err) return next(err);
    res.render('search', { results: tweets, search: req.query.q });
  });
});

app.get('/send', function (req, res) {
  console.log(req.header('host'));
  console.log(req.is('json'));
  console.log(res.header('content-type'));
  res.send([1,2,3]);
})

app.get('/redirect', function (req, res) {
  res.redirect('/');
});

app.get('/user/:name?', function (req, res) {
  req.params.name  =  req.params.name || 'No name'
  res.end(req.params.name);
});

function secure (req, res, next) {
  var login = false;
  if (!login) {
    return res.send(403);
  } else {
    next();
  }
}

app.get('/me', secure, function (res, req, next) {
  next();
});

app.error(function (err, req, res, next) {
  if (err.message == 'Bad twitter response') {
    res.render('twitter-error');
  } else {
    next();
  }
});

/*listen*/
app.listen(3000);