// dataBaseUtils.js

// BASE SETUP
// ================================================

var mssql		= require('mssql');

// Datafields allowed in query statement based on authorization
var	dataFields = {
	create: {
		post: {
			columns: 'ownerName, address, district, province, phone, description, area, price, type, dateCreate, dateUpdate, creatorID, updatorID',
			params: '@ownerName, @address, @district, @province, @phone, @description, @area, @price, @type, @dateCreate, @dateUpdate, @creatorID, @updatorID'
		}
	},
	update: {
		post: 'ownerName=@ownerName, address=@address, district=@district, province=@province, phone=@phone, description=@description, area=@area, price=@price, type=@type, dateUpdate=@dateUpdate, updatorID=@updatorID'
	},
	retrieve: {
		posts: {
			normal: 'id AS postsID, ownerName, address, district, province, phone, description, area, price, type, dateCreate, dateUpdate',
			detailed: 'posts.ID AS postsID, ownerName, address, district, province, phone, description, area, price, type, dateCreate, dateUpdate, creatorID, Creators.username AS creatorName, updatorID, Updators.username AS updatorName'
		},
		postDetail: 'posts.ID AS postsID, ownerName, address, district, province, phone, description, area, price, type, dateCreate, dateUpdate, creatorID, Creators.username AS creatorName, updatorID, Updators.username AS updatorName'
	}
};


// ================================================

// Construct valid query statment for each operation
var generateStatement = {
	posts: {
		get: function(params) {

			var statement = 'SELECT ',
				isDetailed = params.isDetailed;

			delete params.isDetailed;

			if (isDetailed) {
				statement += dataFields.retrieve.posts.detailed
						+ ' FROM tbl_HouseAndLand AS Posts, tbl_Account AS Creators, tbl_Account AS Updators'
						+ ' WHERE Posts.creatorID = Creators.id AND Posts.updatorID = Updators.id';
			} else {
				statement += dataFields.retrieve.posts.normal + ' FROM tbl_HouseAndLand';
			}

			// Get array of available params' keywords
			var paramKeys = Object.keys(params);

			if (paramKeys.length > 0) {

				if (isDetailed) {
					statement += ' AND ';
				} else {
					statement += ' WHERE ';
				}

				for (var i = 0, length = paramKeys.length; i < length; i++) {

					if (i != 0) {
						statement += ' AND ';
					}

					switch(paramKeys[i]) {

						case 'maxPrice':
							statement += 'price <= @' + paramKeys[i];
							break;

						case 'maxArea':
							statement += 'area <= @' + paramKeys[i];
							break;

						case 'minPrice':
							statement += 'price >= @' + paramKeys[i];
							break;

						case 'minArea':
							statement += 'area >= @' + paramKeys[i];
							break;

						default:
							statement += paramKeys[i] + ' = @' + paramKeys[i];
					}
				}
			}

			return statement + ' ORDER BY dateUpdate DESC';
		},

		put: function() {
			return 'INSERT INTO tbl_HouseAndLand (' + dataFields.create.post.columns + ')'
				+ ' VALUES (' + dataFields.create.post.params + ')';
		},

		postDetail: {
			get: function() {
				return 'SELECT ' + dataFields.retrieve.postDetail
					+ ' FROM tbl_HouseAndLand AS Posts, tbl_Account AS Creators, tbl_Account AS Updators'
					+ ' WHERE Posts.creatorID = Creators.id AND Posts.updatorID = Updators.id AND Posts.id = @postID';
			},
			patch: function() {
				return 'UPDATE tbl_HouseAndLand'
					+ ' SET ' + dataFields.update.post
					+ ' WHERE id = @postID';
			},
			delete: function() {
				return 'DELETE FROM tbl_HouseAndLand WHERE id = @postID';
			}
		}
	}
}

// Inject corresponding params to prepared statement
var injectParams = {
	posts: {
		get: function(preparedStatement, params) {
			
			if (params.creatorID) {
				preparedStatement.input('creatorID', mssql.Int);
			}
			if (params.district) {
				preparedStatement.input('district', mssql.NVarChar(50));
			}
			if (params.province) {
				preparedStatement.input('province', mssql.NVarChar(50));
			}
			if (params.minPrice) {
				preparedStatement.input('minPrice', mssql.Decimal(19, 3));
			}
			if (params.maxPrice) {
				preparedStatement.input('maxPrice', mssql.Decimal(19, 3));
			}
			if (params.minArea) {
				preparedStatement.input('minArea', mssql.Decimal(19, 3));
			}
			if (params.maxArea) {
				preparedStatement.input('maxArea', mssql.Decimal(19, 3));
			}

			return preparedStatement;
		},
		put: function(preparedStatement) {

			preparedStatement.input('ownerName', mssql.NVarChar(60));
			preparedStatement.input('address', mssql.NVarChar(150));
			preparedStatement.input('district', mssql.NVarChar(50));
			preparedStatement.input('province', mssql.NVarChar(50));
			preparedStatement.input('phone', mssql.NVarChar(20));
			preparedStatement.input('description', mssql.NVarChar(1000));
			preparedStatement.input('area', mssql.Decimal(19, 3));
			preparedStatement.input('price', mssql.Decimal(19, 3));
			preparedStatement.input('type', mssql.Int);
			preparedStatement.input('dateCreate', mssql.DateTime2(0));
			preparedStatement.input('dateUpdate', mssql.DateTime2(0));
			preparedStatement.input('creatorID', mssql.Int);
			preparedStatement.input('updatorID', mssql.Int);

			return preparedStatement;
		},
		postDetail: {
			get: function(preparedStatement) {

				preparedStatement.input('postID', mssql.Int);
				return preparedStatement;
			},
			patch: function(preparedStatement) {

				preparedStatement.input('postID', mssql.Int);
				preparedStatement.input('ownerName', mssql.NVarChar(60));
				preparedStatement.input('address', mssql.NVarChar(150));
				preparedStatement.input('district', mssql.NVarChar(50));
				preparedStatement.input('province', mssql.NVarChar(50));
				preparedStatement.input('phone', mssql.NVarChar(20));
				preparedStatement.input('description', mssql.NVarChar(1000));
				preparedStatement.input('area', mssql.Decimal(19, 3));
				preparedStatement.input('price', mssql.Decimal(19, 3));
				preparedStatement.input('type', mssql.Int);
				preparedStatement.input('dateUpdate', mssql.DateTime2(0));
				preparedStatement.input('updatorID', mssql.Int);

				return preparedStatement;
			},
			delete: function(preparedStatement) {

				preparedStatement.input('postID', mssql.Int);
				return preparedStatement;
			}
		}
	}
}

// Connect and excecute prepared statement
var execute = function(injectParams, statement, params) {

	return new Promise(function(resolve, reject) {

		// Create database connection
		var mssqlConnector = new mssql.Connection(configs.dbConfig);

		// Connect to database
		mssqlConnector.connect()
			.then(function(){

				// Ready prepared statement
				var preparedStatement = new mssql.PreparedStatement(mssqlConnector);
				// Inject necessary params for operation
				preparedStatement = injectParams(preparedStatement, params);

				preparedStatement.prepare(statement)
					.then(function(){

						// Excecute prepared statement
						preparedStatement.execute(params, function(err, recordSet, rowsAffected) {

							// Check excecution error
							if (err) {

								console.log(err);
								mssqlConnector.close();
								err.status = 500;
								reject(err);
							}

							// Unprepare prepared statement so that next prepared statement can execute
							preparedStatement.unprepare()
								.catch(function(err){
									console.log(err);
								});

							// Close connection
							mssqlConnector.close();

							// Return to promised function recordSet and number of row affected
							var result = {
								recordSet: recordSet,
								rowsAffected: rowsAffected
							};

							// Resolve promise
							resolve(result);
						});
					})
					.catch(function(err){

						mssqlConnector.close();
						console.log(err);
						err.status = 500;
						reject(err);
					});
			})
			.catch(function(err){

				console.log(err);
				err.status = 500;
				reject(err);
			});
	});
}

/*// Connect to database and query
// Deprecated in favour of prepared statement
var query = function(queryString) {

	return new Promise(function(resolve, reject) {

		var mssqlConnector = new mssql.Connection(configs.dbConfig);
		mssqlConnector.connect()
			.then(function(){

				var mssqlRequestor = new mssql.Request(mssqlConnector);
				mssqlRequestor.query(queryString)
					.then(function(resultSet){

						mssqlConnector.close();
						resolve(resultSet);
					})
					.catch(function(err){

						mssqlConnector.close();
						console.log(err);
						err.status = 500;
						reject(err);
					});
			})
			.catch(function(err){

				console.log(err);
				err.status = 500;
				reject(err);
			});
	});
};*/


// ================================================

// Each property represents one operation corresponding to each http route
module.exports = {
	posts: {
		get: function(params){
			return execute(injectParams.posts.get, generateStatement.posts.get(params), params);
		},
		put: function(params){
			return execute(injectParams.posts.put, generateStatement.posts.put(), params);
		},
		postDetail: {
			get: function(params) {
				return execute(injectParams.posts.postDetail.get, generateStatement.posts.postDetail.get(), params);
			},
			patch: function (params) {
				return execute(injectParams.posts.postDetail.patch, generateStatement.posts.postDetail.patch(), params);
			},
			delete: function (params) {
				return execute(injectParams.posts.postDetail.delete, generateStatement.posts.postDetail.delete(), params);
			}
		}
	}
}