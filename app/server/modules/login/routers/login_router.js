// login_router.js

// BASE SETUP
// ================================================

var express 		= require('express');

var authenticator	= require(makeRootPath('server/shared/middlewares/authenticator.js'));

var router			= express.Router();


// ROUTING
// ================================================

// Route for authenticate user (Access at POST http://localhost:[portNumber]/api/authenticate)
router.route('/')
	.get(function(req, res){

		res.sendFile(makeRootPath('public/modules/login/templates/login.html'));
	})
	.post(authenticator.authenticate, function(req, res){
		if(req.authentication.success) {

			res.cookie('token', req.authentication.token, {
				maxAge: 60 * 60,
				httpOnly: true
			});

			res.redirect('/home');
		} else {

			res.sendFile(makeRootPath('public/modules/login/templates/login.html'));
		}
	});

module.exports = router