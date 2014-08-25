var path = require('path');
var Hapi = require('hapi');
var Good = require('good');
var Joi = require('joi');
var config = require('./config');

var server = new Hapi.Server('0.0.0.0', process.env.PORT || config.port);

// static assets - we'd normally only serve index.html here and cache it for a long time
server.route({
	method: 'GET',
	path: '/{path*}',
	handler: {
		directory: {
			path: path.join(__dirname, '/../client/dist'),
			lookupCompressed: true,
			listing: false,
			index: true
		}
	}
});

server.pack.register(Good, function (err) {
	if (err) throw err; // something bad happened loading the plugin
	server.start(function () {
		server.log('info', 'Server running at: ' + server.info.uri);
	});
});
