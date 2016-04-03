//authenticator.js

// BASE SETUP
// ================================================

var	mssql		= require('mssql'),
	jwt			= require('jsonwebtoken');


module.exports = {
	authenticate: function(req, res, next) {

		var mssqlConnector = new mssql.Connection(configs.dbConfig);

		mssqlConnector.connect()
			.then(function(){

				var queryString		= "SELECT username, password, role FROM tbl_Account WHERE username = '" + req.body.username 
										+ "' AND password = '" + req.body.password + "'",
					mssqlRequestor	= new mssql.Request(mssqlConnector);
					
				mssqlRequestor.query(queryString)
					.then(function(resultSet){

						mssqlConnector.close();

						if(resultSet.length == 1) {

							// Authentication succeed
							// Make a jwt
							var payload = {
								username: resultSet[0].username,
								password: resultSet[0].password
							};

							var token = jwt.sign(payload, configs.secret, {
								expiresIn: '1m'
							});

							req.authentication = {
								success: true,
								token: token
							};
							req.authorization = resultSet[0].role;

							next();
						} else {
							
							// Authentication failed
							req.authentication = { success: false, message: 'Authentication failed. Incorrect username/password' };
							next();
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
	},

	authorize: function(req, res, next) {

		// Check header or url parameter or post parameters for jwt
		var token = req.cookies.token || req.body.token || req.query.token || req.get('x-access-token');

		if (token) {

			// Decode token
			jwt.verify(token, configs.secret, function(err, payload) {

				if(err) {

					// Decoded unsuccessfully
					res.status(401).send('Authentication failed.');
				} else {

					var mssqlConnector = new mssql.Connection(configs.dbConfig);

					mssqlConnector.connect()
						.then(function(){
							
							// Decoded successfully
							// Retrieve user's authorization from database
							var queryString		= "SELECT role FROM tbl_Account WHERE username = '" + payload.username 
												+ "' AND password = '" + payload.password + "'",
								mssqlRequestor	= new mssql.Request(mssqlConnector);

							mssqlRequestor.query(queryString)
								.then(function(resultSet){

									mssqlConnector.close();

									if(resultSet.length == 1) {

										req.authorization = resultSet[0].role;
										next();
									} else {
										
										// Authentication failed
										res.status(401).send('Authentication failed.');
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
				}
			});
		} else {

			// No token, authorize user as guest
			req.authorization = configs.roles.guest;
			next();
		}
	}
};