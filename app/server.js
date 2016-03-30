// server.js

// BASE SETUP
// ================================================

//Global utils
global.makeRootPath = function(relativeURI) {
    return __dirname + '/' + relativeURI;
};

// Dependencies
var utils				= require(makeRootPath('server/shared/middlewares/utils.js'));

var	express				= require('express'),
	bodyParser			= require('body-parser'),
	cookieParser		= require('cookie-parser'),
	morgan				= require('morgan');

var router				= require(makeRootPath('server/shared/routers/router.js'));

global.configs			= require(makeRootPath('server/shared/data/configs.js'));

// Configs

// Create express application instance
expressApp	= express();


expressApp.locals.basedir		= __dirname

// Config app to use bodyParser()
// Let us get the data from POST request
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());

// Config app to use cookieParser()
// Let us eat cookies!!
expressApp.use(cookieParser());

// Use morgan to log requests to the console
expressApp.use(morgan('dev'));


// REGISTER ROUTERs
// ================================================

expressApp.use('/', router);


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
var server = expressApp.listen(process.env.PORT || configs.port, function () {
	console.log('IslashF started. Listening on port ' + server.address().port);
});