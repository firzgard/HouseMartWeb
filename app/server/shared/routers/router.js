// api_router.js

// BASE SETUP
// ================================================

var express 		= require('express');

var routerAPI		= require(makeRootPath('server/modules/api/routers/api_router.js')),
	routerLogin		= require(makeRootPath('server/modules/login/routers/login_router.js')),
	routerSignup	= require(makeRootPath('server/modules/signup/routers/signup_router.js'));

var router			= express.Router();

// ROUTING
// ================================================

// Redirect from default to homepage
router.get('/', function(req, res){
	res.redirect('/home');
});

// homepage
router.get('/home', function(req, res){
	res.sendFile(makeRootPath('public/modules/home/templates/home.html'));
});

// login page
router.use('/login', routerLogin);

// Register page
router.use('/signup', routerSignup)

// Route for providing static assets
router.use('/assets', express.static(makeRootPath('public')));

// Route for providing API for android app
router.use('/api', routerAPI);

module.exports = router;