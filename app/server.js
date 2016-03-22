// server.js

// BASE SETUP
// ================================================

// Dependencies
var	express		= require('express'),
	bodyParser	= require('body-parser'),
	mssql		= require('mssql');


// Configs

// Create express application instance
expressApp	= express();

// Config app to use bodyParser()
// Let us get the data from POST request
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());

// mssql's connection configs
var dbConfig = {
	server: "localhost\\MEGAFIRZEN",
	database: "HouseMart",
	user: "HouseMart_Admin",
	password: "123456",
	port: "1433"
};

var port = 3000

// ROUTING
// ================================================
var router = express.Router();

router.route('/api/android')
	// Get all posts (Access at GET http://localhost:3000/api/android)
	.get(function(req, res) {
		var mssqlConnector = new mssql.Connection(dbConfig);

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

// REGISTER OUR ROUTES
// ================================================
expressApp.use('/', router);

// EVENT HANDLERS
// ================================================
function exitHandler(options, err) {
	if (options.cleanup) console.log('Closing Application');
	if (err) console.log(err.stack);
	if (options.exit) process.exit();
}

// EVENTS
// ================================================

//When app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

// START THE SERVER
// ================================================
var server = expressApp.listen(port, function () {
	console.log('IslashF started. Listening on port ' + server.address().port);
});