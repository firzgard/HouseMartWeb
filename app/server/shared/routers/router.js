// api_router.js

// BASE SETUP
// ================================================

"use strict";

var express 		= require('express');

var routerAPI		= require(makeRootPath('app/server/modules/api/routers/api_router.js')),
	routerLogin		= require(makeRootPath('app/server/modules/login/routers/login_router.js')),
	routerSignup	= require(makeRootPath('app/server/modules/signup/routers/signup_router.js')),
	routerAssets	= require(makeRootPath('app/server/shared/routers/asset_router.js'));

var router			= express.Router();

var authenticator	= require(makeRootPath('app/server/shared/middlewares/authenticator.js'));

// ROUTING
// ================================================

// Route for providing static assets
router.use('/assets', routerAssets);

// Redirect from default to homepage
router.get('/', authenticator.authorize, function(req, res){
	res.redirect('/home');
});

// homepage
router.get('/home', authenticator.authorize, function(req, res){
	res.render(makeRootPath('app/server/modules/home/templates/home.jade'), req.authorization);
});

// login page
router.use('/login', routerLogin);

// Register page
router.use('/signup', routerSignup);

// Register page
router.get('/management', authenticator.authorize, function(req, res){

	if(req.authorization.role === configs.roles.guest) {
		res.redirect('/home');
	}
	res.render(makeRootPath('app/server/modules/management/templates/management.jade'), req.authorization);
});

// Route for providing API for android app
router.use('/api', routerAPI);

module.exports = router;