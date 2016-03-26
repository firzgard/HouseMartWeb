// api_router.js

// BASE SETUP
// ================================================

var express 	= require('express'),
	mssql		= require('mssql');

var router		= express.Router();

var routerAPI	= require(makeRootPath('server/modules/api/routers/api_router.js'));


// ROUTING
// ================================================

// Redirect from default to homepage
router.get('/', function(req, res){
	res.redirect('/home');
});

// homepage
router.get('/home', function(req, res){
	res.sendfile(makeRootPath('public/modules/home/templates/home.html'));
});

// login page
router.get('/login', function(req, res){
	res.sendfile(makeRootPath('public/modules/login/templates/login.html'));
});

// Route for providing static assets
router.use('/assets', express.static(makeRootPath('public')));

// Route for providing API for android app
router.use('/api', routerAPI);

module.exports = router;