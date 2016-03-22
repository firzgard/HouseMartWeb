// server.js

// BASE SETUP
// ================================================

//Global utils
global.makeRootPath = function(relativeURI) {
    return __dirname + '/' + relativeURI;
}

// Dependencies
var utils				= require(makeRootPath('server/assets/utils'));

var	express				= require('express'),
	bodyParser			= require('body-parser'),
	mssql				= require('mssql');

var routerAPIAndroid	= require(makeRootPath('server/routes/router_api_android'));

global.consts			= require(makeRootPath('server/assets/consts'));

// Configs

// Create express application instance
expressApp	= express();

// Config app to use bodyParser()
// Let us get the data from POST request
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());



var port = 3000;

// ROUTING
// ================================================


// REGISTER OUR ROUTES
// ================================================

// Router for providing API for android app
expressApp.use('/api/android', routerAPIAndroid);

// EVENT HANDLERS
// ================================================

function exitHandler(options, err) {
	if (options.cleanup) console.log('Closing Application');
	if (err) console.log(err.stack);
	if (options.exit) process.exit();
}

// EVENTS
// ================================================

//When app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

// START THE SERVER
// ================================================
var server = expressApp.listen(port, function () {
	console.log('IslashF started. Listening on port ' + server.address().port);
});