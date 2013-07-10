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
    req.session.user = req.body.user;
    res.json({ error: '' });
}

exports.logput = function (req, res) {
    req.session.destroy();
    res.redirect('/');
}
