// login_router.js

// BASE SETUP
// ================================================

var express 		= require('express');

var authenticator	= require(makeRootPath('server/shared/middlewares/authenticator.js'));

var router			= express.Router();


// ROUTING
// ================================================


router.route('/')
	// Route for getting login page (Access at GET http://(host)[:(port)]/login)
	.get(authenticator.authorize, function(req, res){

		if(req.authorization == 0) {

			res.render(makeRootPath('server/modules/login/templates/login.jade'));
		} else {

			res.redirect('/home');
		}
	})
	// Route for logging in (Access at POST http://(host)[:(port)]/login)
	.post(authenticator.authenticate, function(req, res){

		if(req.authentication.success) {

			res.cookie('token', req.authentication.token, {
				maxAge: (60 * 60 * 1000),
				httpOnly: true
			});

			res.redirect('/home');
		} else {

			res.render(makeRootPath('server/modules/login/templates/login.jade'));
		}
	});

module.exports = router