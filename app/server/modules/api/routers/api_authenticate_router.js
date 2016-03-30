// api_android_router.js

// BASE SETUP
// ================================================

var express 	= require('express');

var router		= express.Router();

var authenticator	= require(makeRootPath('server/shared/middlewares/authenticator.js'));


// ROUTING
// ================================================

// Route for authenticate user (Access at POST http://(host)[:(port)]/api/authenticate)
router.post('/', authenticator.authenticate, function(req, res) {
	res.json(req.authentication)
});

module.exports = router;