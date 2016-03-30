// api_router.js

// BASE SETUP
// ================================================

var express 				= require('express'),
	mssql					= require('mssql'),
	jwt						= require('jsonwebtoken');

var routerAPIPosts			= require(makeRootPath('server/modules/api/routers/api_posts_router.js')),
	routerAPIUsers			= require(makeRootPath('server/modules/api/routers/api_users_router.js')),
	routerAPIAuthenticate	= require(makeRootPath('server/modules/api/routers/api_authenticate_router.js'));

var router					= express.Router();


// ROUTING
// ================================================

// Route for authenticate user
router.use('/authenticate', routerAPIAuthenticate);

// Routes for User API
router.use('/users', routerAPIUsers);

// Routes for Post API
router.use('/posts', routerAPIPosts)

module.exports = router;