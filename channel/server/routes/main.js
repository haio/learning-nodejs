'use strict';

var localIPEth0 = (function () {
    return require('os').networkInterfaces().eth0[0].address;
})();
var serverName = localIPEth0 + ':3000';

/*
    main routes
*/
exports.index = function (req, res) {
    res.render('index', { title:'Express', server:serverName, user:req.session.user});
};

exports.users = function (req, res) {
    var user = req.body.user;
    req.session.user = user;
    res.json({ user: user });
}

exports.logput = function (req, res) {
    req.session.destroy();
    res.redirect('/');
}
