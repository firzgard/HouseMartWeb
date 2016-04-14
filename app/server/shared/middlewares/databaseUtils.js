// dataBaseUtils.js

// BASE SETUP
// ================================================

var mssql		= require('mssql');

// Datafields for query statements
var	dataFields = {
	create: {
		post: {
			columns: 'ownerName, address, districtID, title, phone, description, area, price, type, latitude, longitude, isPublic, dateCreate, dateUpdate, creatorID, updatorID',
			params: '@ownerName, @address, @districtID, @title, @phone, @description, @area, @price, @type, @latitude, @longitude, @isPublic, @dateCreate, @dateUpdate, @creatorID, @updatorID'
		}
	},
	retrieve: {
		posts: {
			normal: 'id AS postID, address, Districts.districtID AS districtID, Districts.districtName AS districtName, Provinces.provinceID AS provinceID, Provinces.provinceName AS provinceName, title, area, price, type, image1, image2, image3, dateCreate, dateUpdate',
			detailed: 'posts.id AS postID, address, Districts.districtID AS districtID, Districts.districtName AS districtName, Provinces.provinceID AS provinceID, Provinces.provinceName AS provinceName, title, area, price, type, image1, image2, image3, isPublic, dateCreate, dateUpdate, creatorID, Creators.username AS creatorName, updatorID, Updators.username AS updatorName'
		},
		postDetail: 'posts.id AS postID, ownerName, address, Districts.districtID AS districtID, Districts.districtName AS districtName, Provinces.provinceID AS provinceID, Provinces.provinceName AS provinceName, title, phone, description, area, price, type, latitude, longitude, image1, image2, image3, isPublic, dateCreate, dateUpdate, creatorID, Creators.username AS creatorName, updatorID, Updators.username AS updatorName',
		districts: 'districtID, districtName, Provinces.provinceID AS provinceID, provinceName',
		provinces: 'provinceID, provinceName'
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
						+ ' FROM tbl_HouseAndLand AS Posts, tbl_Account AS Creators, tbl_Account AS Updators, tbl_Districts AS Districts, tbl_Provinces AS Provinces'
						+ ' WHERE Posts.creatorID = Creators.id AND Posts.updatorID = Updators.id AND Posts.districtID = Districts.districtID AND Provinces.provinceID = Districts.provinceID';
			} else {
				statement += dataFields.retrieve.posts.normal
						+ ' FROM tbl_HouseAndLand AS Posts, tbl_Districts AS Districts, tbl_Provinces AS Provinces'
						+ ' WHERE Posts.districtID = Districts.districtID AND Provinces.provinceID = Districts.provinceID AND isPublic = 1';
			}

			// Get array of available params' keywords
			var paramKeys = Object.keys(params);

			if (paramKeys.length > 0) {

				statement += ' AND ';

				for (var i = 0, length = paramKeys.length; i < length; i++) {

					if (i != 0) {
						statement += ' AND ';
					}

					switch(paramKeys[i]) {

						case 'maxPrice':
							statement += 'price <= @maxPrice';
							break;

						case 'minPrice':
							statement += 'price >= @minPrice';
							break;

						case 'maxArea':
							statement += 'area <= @maxArea';
							break;

						case 'minArea':
							statement += 'area >= @minArea';
							break;

						case 'creatorID':
							statement += 'Posts.' + paramKeys[i] + ' = @' + paramKeys[i];
							break;

						case 'districtID':
							statement += 'Districts.' + paramKeys[i] + ' = @' + paramKeys[i];
							break;

						case 'provinceID':
							statement += 'Provinces.' + paramKeys[i] + ' = @' + paramKeys[i];
							break;
					}
				}
			}

			return statement + ' ORDER BY dateUpdate DESC';
		},

		put: function() {
			return 'INSERT INTO tbl_HouseAndLand (' + dataFields.create.post.columns + ')'
				+ ' VALUES (' + dataFields.create.post.params + '); SELECT SCOPE_IDENTITY() AS postID';
		},

		postDetail: {
			get: function() {
				return 'SELECT ' + dataFields.retrieve.postDetail
					+ ' FROM tbl_HouseAndLand AS Posts, tbl_Account AS Creators, tbl_Account AS Updators, tbl_Districts AS Districts, tbl_Provinces AS Provinces'
					+ ' WHERE Posts.creatorID = Creators.id AND Posts.updatorID = Updators.id AND Posts.districtID = Districts.districtID AND Provinces.provinceID = Districts.provinceID AND Posts.id = @postID';
			},
			patch: function(params) {

				var updateFields = '';

				// Get array of available params' keywords (postID not included)
				var paramKeys = Object.keys(params);
				paramKeys.splice(paramKeys.indexOf('postID'), 1);

				if (paramKeys.length > 0) {

					for (var i = 0, length = paramKeys.length, limit = length-1; i < length; i++) {

						updateFields += paramKeys[i] + '=@' + paramKeys[i];

						if (i != limit) {
							updateFields += ', ';
						}
					}
				}

				console.log(updateFields);

				return 'UPDATE tbl_HouseAndLand'
					+ ' SET ' + updateFields
					+ ' WHERE id = @postID';
			},
			delete: function() {
				return 'DELETE FROM tbl_HouseAndLand WHERE id = @postID; SELECT SCOPE_IDENTITY() AS postID';
			}
		}
	},
	districts:{
		get: function() {
			return 'SELECT ' + dataFields.retrieve.districts
				+ ' FROM tbl_Districts AS Districts, tbl_Provinces AS Provinces';
		}
	},
	provinces: {
		get: function() {
			return 'SELECT ' + dataFields.retrieve.provinces
				+ ' FROM tbl_Provinces';
		}
	}
}

// Inject corresponding params to prepared statement
var injectParams = {
	posts: {
		get: function(preparedStatement, params) {
			
			if (typeof params.creatorID !== 'undefined') {
				preparedStatement.input('creatorID', mssql.Int);
			}
			if (typeof params.districtID !== 'undefined') {
				preparedStatement.input('districtID', mssql.NVarChar(50));
			}
			if (typeof params.provinceID !== 'undefined') {
				preparedStatement.input('provinceID', mssql.NVarChar(50));
			}
			if (typeof params.minPrice !== 'undefined') {
				preparedStatement.input('minPrice', mssql.Decimal(19, 3));
			}
			if (typeof params.maxPrice !== 'undefined') {
				preparedStatement.input('maxPrice', mssql.Decimal(19, 3));
			}
			if (typeof params.minArea !== 'undefined') {
				preparedStatement.input('minArea', mssql.Decimal(19, 3));
			}
			if (typeof params.maxArea !== 'undefined') {
				preparedStatement.input('maxArea', mssql.Decimal(19, 3));
			}

			return preparedStatement;
		},
		put: function(preparedStatement) {

			preparedStatement.input('ownerName', mssql.NVarChar(60));
			preparedStatement.input('address', mssql.NVarChar(150));
			preparedStatement.input('districtID', mssql.NVarChar(50));
			preparedStatement.input('title', mssql.NVarChar(50));
			preparedStatement.input('phone', mssql.NVarChar(20));
			preparedStatement.input('description', mssql.NVarChar(1000));
			preparedStatement.input('area', mssql.Decimal(19, 3));
			preparedStatement.input('price', mssql.Decimal(19, 3));
			preparedStatement.input('type', mssql.Int);
			preparedStatement.input('longitude', mssql.Decimal(9, 6));
			preparedStatement.input('latitude', mssql.Decimal(9, 6));
			preparedStatement.input('isPublic', mssql.Bit);
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
			patch: function(preparedStatement, params) {

				if (typeof params.postID !== 'undefined') {
					preparedStatement.input('postID', mssql.Int);
				}
				if (typeof params.ownerName !== 'undefined') {
					preparedStatement.input('ownerName', mssql.NVarChar(60));
				}
				if (typeof params.address !== 'undefined') {
					preparedStatement.input('address', mssql.NVarChar(150));
				}
				if (typeof params.districtID !== 'undefined') {
					preparedStatement.input('districtID', mssql.NVarChar(50));
				}
				if (typeof params.title !== 'undefined') {
					preparedStatement.input('title', mssql.NVarChar(50));
				}
				if (typeof params.phone !== 'undefined') {
					preparedStatement.input('phone', mssql.NVarChar(20));
				}
				if (typeof params.description !== 'undefined') {
					preparedStatement.input('description', mssql.NVarChar(1000));
				}
				if (typeof params.area !== 'undefined') {
					preparedStatement.input('area', mssql.Decimal(19, 3));
				}
				if (typeof params.price !== 'undefined') {
					preparedStatement.input('price', mssql.Decimal(19, 3));
				}
				if (typeof params.type !== 'undefined') {
					preparedStatement.input('type', mssql.Int);
				}
				if (typeof params.longitude !== 'undefined') {
					preparedStatement.input('longitude', mssql.Decimal(9, 6));
				}
				if (typeof params.latitude !== 'undefined') {
					preparedStatement.input('latitude', mssql.Decimal(9, 6));
				}
				if (typeof params.image1 !== 'undefined') {
					preparedStatement.input('image1', mssql.NVarChar(200));
				}
				if (typeof params.image2 !== 'undefined') {
					preparedStatement.input('image2', mssql.NVarChar(200));
				}
				if (typeof params.image3 !== 'undefined') {
					preparedStatement.input('image3', mssql.NVarChar(200));
				}
				if (typeof params.isPublic !== 'undefined') {
					preparedStatement.input('isPublic', mssql.Bit);
				}
				if (typeof params.dateUpdate !== 'undefined') {
					preparedStatement.input('dateUpdate', mssql.DateTime2(0));
				}
				if (typeof params.updatorID !== 'undefined') {
					preparedStatement.input('updatorID', mssql.Int);
				}

				return preparedStatement;
			},
			delete: function(preparedStatement) {

				preparedStatement.input('postID', mssql.Int);
				return preparedStatement;
			}
		}
	},
	districts:{
		get: function(preparedStatement) {
			return preparedStatement;
		}
	},
	provinces: {
		get: function(preparedStatement) {
			return preparedStatement;
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
								
								err.status = 409;

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

						err.status = 400;

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
				return execute(injectParams.posts.postDetail.patch, generateStatement.posts.postDetail.patch(params), params);
			},
			delete: function (params) {
				return execute(injectParams.posts.postDetail.delete, generateStatement.posts.postDetail.delete(), params);
			}
		}
	},
	districts: {
		get: function(){
			return execute(injectParams.districts.get, generateStatement.districts.get(), {});
		}
	},
	provinces: {
		get: function(){
			return execute(injectParams.provinces.get, generateStatement.provinces.get(), {});
		}
	}
}