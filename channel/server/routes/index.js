'use strict';

var app = require('../server').app
	, main = require('./main');

/*
 	routes
 */
app.get('/', main.index);
app.post('/users', main.users);
app.get('/logout', main.logput);
