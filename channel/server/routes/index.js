/*
 * GET home page.
 */
var serverName = process.env.HOST ? process.env.HOST + ":" + process.env.PORT : 'localhost:3000';

exports.index = function (req, res) {
    //save user from previous session (if it exists)
    var user = req.session.user;
    //regenerate new session & store user from previous session (if it exists)
    req.session.regenerate(function (err) {
        req.session.user = user;
        res.render('index', { title:'Express', server:serverName, user:req.session.user});
    });
};