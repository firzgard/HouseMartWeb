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
				var queryString		= "SELECT 1 FROM tbl_Account WHERE username = '" + req.body.username + "' AND password = '" + req.body.password + "'",
					mssqlRequestor	= new mssql.Request(mssqlConnector);

				mssqlRequestor.query(queryString)
					.then(function(resultSet){
						mssqlConnector.close();

						if(resultSet.length == 0) {
							// Authentication failed
							req.authentication = { success: false, message: 'Authentication failed. Incorrect username/password' };
							next();
						} else {
							// Authentication succeed
							// Sending jwt over
							var payload = {
								username: req.body.username,
								password: req.body.password
							};

							var token = jwt.sign(payload, configs.secret, {
								expiresIn: '1m'
							});
							req.authentication = {
								success: true,
								token: token
							};
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
	}
};