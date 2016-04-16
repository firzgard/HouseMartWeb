// api_router.js

// BASE SETUP
// ================================================

"use strict";

var express 				= require('express'),
	mssql					= require('mssql'),
	jwt						= require('jsonwebtoken');

// Routers
var routerAPIPosts			= require(makeRootPath('app/server/modules/api/routers/api_posts_router.js')),
	routerAPIUsers			= require(makeRootPath('app/server/modules/api/routers/api_users_router.js')),
	routerAPIAuthenticate	= require(makeRootPath('app/server/modules/api/routers/api_authenticate_router.js'));

// Middlewares
var databaseUtils			= require(makeRootPath('app/server/shared/middlewares/databaseUtils.js'));

var router					= express.Router();


// ROUTING
// ================================================

// Route for authenticate user
router.use('/authenticate', routerAPIAuthenticate);

// Routes for User API
router.use('/users', routerAPIUsers);

// Routes for Post API
router.use('/posts', routerAPIPosts)

// Route to get district list
router.get('/districts', function(req, res) {
	databaseUtils.districts.get()
		.then(function(result){
			return res.json(result.recordSet);
		})
		.catch(function(err){
			if(err.status){
				return res.sendStatus(err.status);
			}
			return res.sendStatus(500);
		});
})

// Route to get province list
router.use('/provinces', function(req, res) {
	databaseUtils.provinces.get()
		.then(function(result){
			return res.json(result.recordSet);
		})
		.catch(function(err){
			if(err.status){
				return res.sendStatus(err.status);
			}
			return res.sendStatus(500);
		});
})

module.exports = router;