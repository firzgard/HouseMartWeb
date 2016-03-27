// api_android_router.js

// BASE SETUP
// ================================================

var express 	= require('express'),
	mssql		= require('mssql'),
	jwt			= require('jsonwebtoken');

var router		= express.Router();


// ROUTING
// ================================================

/*router.use(function(req, res, next){
	// Check header or url parameter or post parameters for jwt
	var token = req.cookies.token || req.body.token || req.query.token || req.get('x-access-token');

	if (token) {
		// Decode token
		jwt.verify(token, configs.secret, function(err, decoded) {
			if(err) {
				// Decode
				return res.status(401).send({
					success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				req.decoded = decoded;
				console.log(decoded);
				next();
			}
		});
	} else {
		// No token
		return res.status(403).send({
			success: false,
			message: 'No access token provided.'
		})
	}
});*/

// Routes for android API
router.route('/')
	// Get all posts (Access at GET http://localhost:[portNumber]/api/android)
	.get(function(req, res) {
		var mssqlConnector = new mssql.Connection(configs.dbConfig);

		mssqlConnector.connect()
			.then(function(){
				var mssqlRequestor = new mssql.Request(mssqlConnector);

				mssqlRequestor.query("SELECT * FROM tbl_HouseAndLand")
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
	});

module.exports = router;