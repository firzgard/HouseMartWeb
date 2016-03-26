// api_router.js

// BASE SETUP
// ================================================

var express 	= require('express'),
	mssql		= require('mssql');

var router		= express.Router();


// ROUTING
// ================================================

router.route('/android')
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
						res.send(err);
					});
			})
			.catch(function(err){
				console.log(err);
				res.send(err);
			});
	});

module.exports = router;