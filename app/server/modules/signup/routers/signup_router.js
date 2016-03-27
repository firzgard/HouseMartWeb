// signup_router.js

// BASE SETUP
// ================================================

var express 				= require('express'),
	mssql					= require('mssql'),
	jwt						= require('jsonwebtoken'),
	authenticator			= require

var router					= express.Router();


// ROUTING
// ================================================

// Routes for register new account
router.route('/')
	// Get register page (Access at GET http://localhost:[portNumber]/register)
	.get(function(req, res){
		res.render('server/modules/register/templates/register.jade')
	})
	// Send register form (Access at POST http://localhost:[portNumber]/register)
	.post(function(req, res){
		var mssqlConnector = new mssql.Connection(configs.dbConfig);

		mssqlConnector.connect()
			.then(function(){
				var queryString	= "SELECT 1 FROM tbl_Account WHERE username = '" + req.body.username + "'";
				var mssqlRequestor = new mssql.Request(mssqlConnector);

				mssqlRequestor.query(queryString)
					.then(function(resultSet1){
						mssqlConnector.close();

						if(resultSet1.length == 0) {
							queryString = "INSERT INTO tbl_Account VALUES ('" + req.body.username + "','" + req.body.password + "',2)";
							mssqlRequestor = new mssql.Request(mssqlConnector);

							mssqlRequestor.query(queryString)
								.then(function(resultSet2){
									mssqlConnector.close();

									res.status(200).json({
								        status: 'Registration successful!'
								      });
								}).catch(function(err){
									mssqlConnector.close();
									console.log(err);
									res.sendStatus(500);
								});
						} else {
							res.json({
								success: false,
								message: 'This username is already existed. Please choose another one.'
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
	})

module.exports = router;