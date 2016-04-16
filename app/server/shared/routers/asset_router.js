// api_router.js

// BASE SETUP
// ================================================

"use strict";

var express 		= require('express');

var routerAPI		= require(makeRootPath('app/server/modules/api/routers/api_router.js')),
	routerLogin		= require(makeRootPath('app/server/modules/login/routers/login_router.js')),
	routerSignup	= require(makeRootPath('app/server/modules/signup/routers/signup_router.js'));

var router			= express.Router();

var authenticator	= require(makeRootPath('app/server/shared/middlewares/authenticator.js'));

// ROUTING
// ================================================

// Route for providing specific libraries
router.use('/libs/jquery', express.static(makeRootPath('node_modules/jquery/dist')));
router.use('/libs/lodash', express.static(makeRootPath('node_modules/lodash')));
router.use('/libs/waypoints', express.static(makeRootPath('node_modules/waypoints/lib')));

router.use('/libs/bootstrap', express.static(makeRootPath('node_modules/bootstrap/dist')));

router.use('/libs/angular', express.static(makeRootPath('node_modules/angular')));
router.use('/libs/angular-simple-logger', express.static(makeRootPath('node_modules/angular-google-maps/node_modules/angular-simple-logger/dist')));
router.use('/libs/angular-resource', express.static(makeRootPath('node_modules/angular-resource')));
router.use('/libs/angular-ui-router', express.static(makeRootPath('node_modules/angular-ui-router/release')));
router.use('/libs/angular-ui-bootstrap', express.static(makeRootPath('node_modules/angular-ui-bootstrap/dist')));
router.use('/libs/angular-ui-scrollpoint', express.static(makeRootPath('bower_components/angular-ui-scrollpoint/dist')));
router.use('/libs/angular-google-maps', express.static(makeRootPath('node_modules/angular-google-maps/dist')));
router.use('/libs/angular-utils-pagination', express.static(makeRootPath('node_modules/angular-utils-pagination')));
router.use('/libs/angular-waypoints', express.static(makeRootPath('bower_components/angular-waypoints/dist')));

// Route for providing assets that requires rendering

router.use('/templates/postEditor.html', authenticator.authorize, function(req, res){
	return res.render(makeRootPath('app/server/modules/postLoader/templates/postEditor.jade'), req.authorization);
});


// Route for providing static assets
router.use('/', express.static(makeRootPath('app/public')));


module.exports = router;