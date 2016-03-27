// api_router.js

// BASE SETUP
// ================================================

var express 				= require('express'),
	mssql					= require('mssql'),
	jwt						= require('jsonwebtoken');

var routerAPIAndroid		= require(makeRootPath('server/modules/api/routers/api_android_router.js')),
	routerAPIAuthenticate	= require(makeRootPath('server/modules/api/routers/api_authenticate_router.js'));

var router					= express.Router();


// ROUTING
// ================================================

// Route for authenticate user (Access at POST http://localhost:[portNumber]/api/authenticate)
router.use('/authenticate', routerAPIAuthenticate);

// Routes for android API
router.use('/android', routerAPIAndroid);

module.exports = router;