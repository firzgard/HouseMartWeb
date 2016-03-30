// api_users_router.js

// BASE SETUP
// ================================================

var express 	= require('express'),
	mssql		= require('mssql'),
	jwt			= require('jsonwebtoken');

var router		= express.Router();


// ROUTING
// ================================================

// Routes for Post API
router.route('/')
	// Get all users (Access at GET http://(host)[:(port)]/api/users)
	.get(function(req, res) {
		res.send('GET http://(host)[:(port)]/api/users');
	})
	// Create user account (Access at POST http://(host)[:(port)]/api/users)
	.post(function(req,res) {
		res.send('POST http://(host)[:(port)]/api/users');
	});


router.route('/:userID')
	// Get 1 user's infos (Access at GET http://(host)[:(port)]/api/users/(userID))
	.get(function(req, res) {
		res.send('GET http://(host)[:(port)]/api/users/(userID)');
	})
	// Edit 1 user's infos (Access at POST http://(host)[:(port)]/api/users/(userID))
	.post(function(req,res) {
		res.send('POST http://(host)[:(port)]/api/users/(userID)');
	})
	// Delete 1 user (Access at DELETE http://(host)[:(port)]/api/users/(userID))
	.delete(function(req,res) {
		res.send('DELETE http://(host)[:(port)]/api/users/(userID)');
	});

// Get all posts sent by a user (Access at GET http://(host)[:(port)]/api/users/(userID)/posts)
router.get('/:userID/posts', function(req, res) {
	res.send('GET http://(host)[:(port)]/api/users/(userID)/posts');
});

module.exports = router;