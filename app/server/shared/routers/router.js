// api_router.js

// BASE SETUP
// ================================================

var express 		= require('express');

var routerAPI		= require(makeRootPath('server/modules/api/routers/api_router.js')),
	routerLogin		= require(makeRootPath('server/modules/login/routers/login_router.js')),
	routerSignup	= require(makeRootPath('server/modules/signup/routers/signup_router.js'));

var router			= express.Router();

var authenticator	= require(makeRootPath('server/shared/middlewares/authenticator.js'));

// ROUTING
// ================================================

// Route for providing static assets
router.use('/assets', express.static(makeRootPath('public')));

// Redirect from default to homepage
router.get('/', function(req, res){
	res.redirect('/home');
});

// homepage
router.get('/home', authenticator.authorize, function(req, res){
	res.sendFile(makeRootPath('public/modules/home/templates/home.html'));
});

// login page
router.use('/login', routerLogin);

// Register page
router.use('/signup', authenticator.authorize, routerSignup);

// Register page
router.get('/management', authenticator.authorize, function(req, res){
	res.render(makeRootPath('server/modules/management/templates/management.jade'))
});

// Route for providing API for android app
router.use('/api', authenticator.authorize, routerAPI);

module.exports = router;