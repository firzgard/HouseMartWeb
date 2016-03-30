// api_posts_router.js

// BASE SETUP
// ================================================

var express 	= require('express'),
	mssql		= require('mssql'),
	jwt			= require('jsonwebtoken');

var router		= express.Router();

var authenticator	= require(makeRootPath('server/shared/middlewares/authenticator.js'));


// ROUTING
// ================================================

// Routes for Post API
router.route('/')
	// Get all posts (Access at GET http://(host)[:(port)]/api/posts)
	.get(function(req, res) {
		var mssqlConnector = new mssql.Connection(configs.dbConfig);

		mssqlConnector.connect()
			.then(function(){
				var mssqlRequestor = new mssql.Request(mssqlConnector);

				mssqlRequestor.query("SELECT " + dataFields + " FROM tbl_HouseAndLand ORDER BY dateUpdate")
					.then(function(resultSet){
						mssqlConnector.close();
						res.json(resultSet);
					})
					.catch(function(err){
						mssqlConnector.close();
						console.log(err);
						res.sendStatus(500);
					});
			})
			.catch(function(err){
				console.log(err);
				res.sendStatus(500);
			});
	})
	// Post a new post (Access at POST http://(host)[:(port)]/api/posts)
	.post(function(req, res){
		res.send('POST http://(host)[:(port)]/api/posts');
	});


router.route('/:id')
	// Get 1 post's detailed infos (Access at GET http://(host)[:(port)]/api/posts/(postID))
	.get(function(req, res) {
		res.send('GET http://(host)[:(port)]/api/posts/(postID)');
	})
	// Edit 1 post (Access at POST http://(host)[:(port)]/api/posts/(postID))
	.post(function(req, res){
		res.send('POST http://(host)[:(port)]/api/posts/(postID)');
	})
	// Delete 1 post (Access at DELETE http://(host)[:(port)]/api/posts/(postID))
	.delete(function(req, res){
		res.send('DELETE http://(host)[:(port)]/api/posts/(postID)');
	})


module.exports = router;