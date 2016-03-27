// api_android_router.js

// BASE SETUP
// ================================================

var express 	= require('express'),
	mssql		= require('mssql'),
	jwt			= require('jsonwebtoken');

var router		= express.Router();


// ROUTING
// ================================================

// Route for authenticate user (Access at POST http://localhost:[portNumber]/api/authenticate)
router.post('/', function(req, res) {
	var mssqlConnector = new mssql.Connection(configs.dbConfig);

	mssqlConnector.connect()
		.then(function(){
			var queryString		= "SELECT 1 FROM tbl_Account WHERE username = '" + req.body.username + "' AND password = '" + req.body.password + "'",
				mssqlRequestor	= new mssql.Request(mssqlConnector);

			mssqlRequestor.query(queryString)
				.then(function(resultSet){
					mssqlConnector.close();

					if(resultSet.length == 0) {
						// Authentication failed
						res.json({ success: false, message: 'Authentication failed. Incorrect username/password' });
					} else {
						// Authentication succeed
						// Sending jwt over
						var payload = {
							username: '' + req.body.username,
							password: '' + req.body.password
						};

						var token = jwt.sign(payload, configs.secret, {
							expiresIn: '1m'
						});

						res.json({
							success: true,
							token: token
						})
					}
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