//authenticator.js

// BASE SETUP
// ================================================

var	jwt			= require('jsonwebtoken'),
	mssql		= require('mssql');

// Middlewares
var databaseUtils	= require(makeRootPath('app/server/shared/middlewares/databaseUtils.js'));

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

							// Token expire in 1 hour
							var token = jwt.sign(payload, configs.secret, {
								expiresIn: '1h'
							});

							req.authentication = {
								success: true,
								token: token
							};
							req.authorization = {
								userID: resultSet[0].id,
								username: resultSet[0].username,
								role: resultSet[0].role
							};

							return next();
						} else {
							
							// Authentication failed
							req.authentication = { success: false, message: 'Incorrect username/password.' };
							return next();
						}
					})
					.catch(function(err){

						mssqlConnector.close();
						console.log(err);
						return res.sendStatus(500);
					});
			})
			.catch(function(err){

				console.log(err);
				return res.sendStatus(500);
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
					return res.status(401).send('Authentication failed.');
				} else {

					// If the token is less than 10min to timeout, refresh it
					if ((payload.exp - ( Date.now() / 1000 )) < (10 * 60))
					{
							// Make a jwt
							// Token expire in 1 hour
							var token = jwt.sign({
								username: payload.username,
								password: payload.password
							}, configs.secret, {
								expiresIn: '1h'
							});

							res.cookie('token', token, {
								maxAge: (60 * 60 * 1000),
								httpOnly: true
						});
					}

					var mssqlConnector = new mssql.Connection(configs.dbConfig);

					mssqlConnector.connect()
						.then(function(){
							
							// Decoded successfully
							// Retrieve user's authorization from database
							var queryString		= "SELECT id, role FROM tbl_Account WHERE username = '" + payload.username
												+ "' AND password = '" + payload.password + "'",
								mssqlRequestor	= new mssql.Request(mssqlConnector);

							mssqlRequestor.query(queryString)
								.then(function(resultSet){

									mssqlConnector.close();

									if(resultSet.length == 1) {

										req.authorization = {
											userID: resultSet[0].id,
											username: payload.username,
											role: resultSet[0].role
										};
										return next();
									} else {
										
										// Authentication failed
										return res.status(401).send('Authentication failed.');
									}
								})
								.catch(function(err){

									mssqlConnector.close();
									console.log(err);
									return res.sendStatus(500);
								});
						})
						.catch(function(err){

							console.log(err);
							return res.sendStatus(500);
						});
				}
			});
		} else {

			// No token, authorize user as guest
			req.authorization = {
				role: configs.roles.guest
			};
			return next();
		}
	},

	validatePostCreator: function(req, res, next) {

		switch(req.authorization.role) {
			case configs.roles.guest:

				return res.sendStatus(401);
				break;

			case configs.roles.admin:

				return next();
				break;

			case configs.roles.user:
				
				var mssqlConnector = new mssql.Connection(configs.dbConfig);

				mssqlConnector.connect()
					.then(function(){

						var queryString		= "SELECT creatorID FROM tbl_HouseAndLand WHERE id = " + req.params.postID,
							mssqlRequestor	= new mssql.Request(mssqlConnector);
							
						mssqlRequestor.query(queryString)
							.then(function(resultSet){

								mssqlConnector.close();

								if(resultSet.length > 0) {

									if(resultSet[0].creatorID == req.authorization.userID){
										return next();
									} else {
										return res.sendStatus(403);
									}

									
								} else {
									
									return res.status(404).send({message: 'Invalid item ID!!'})
								}
							})
							.catch(function(err){

								mssqlConnector.close();
								console.log(err);
								return res.sendStatus(500);
							});
					})
					.catch(function(err){

						console.log(err);
						return res.sendStatus(500);
					});

				break;
		}
	}
};