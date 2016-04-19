// api_posts_router.js

// BASE SETUP
// ================================================

"use strict";

var express 	= require('express');

// Middlewares
var authenticator	= require(makeRootPath('app/server/shared/middlewares/authenticator.js')),
	databaseUtils	= require(makeRootPath('app/server/shared/middlewares/databaseUtils.js')),
	paramProcessor	= require(makeRootPath('app/server/modules/api/middlewares/api_paramProcessor.js'));

var router		= express.Router();


// ROUTING
// ================================================

// Register middleware for authorization
router.use(authenticator.authorize);

// Routes for posts API
router.route('/')
	// Get/search posts (Access at GET http://(host)[:(port)]/api/posts[?[creatorID=(creatorID)][&][districtID=(districtID)][&][minPrice=(minPrice)][&][maxPrice=(maxPrice)][&][minArea=(minArea)][&][maxArea=(maxArea)][&][isDetailed=(isDetailed)]])
	.get(paramProcessor.posts.get, function(req, res) {

		databaseUtils.posts.get(req.query)
			.then(function(result){
				return res.json(result.recordSet);
			})
			.catch(function(err){
				if(err.status){
					return res.sendStatus(err.status);
				}
				return res.sendStatus(500);
			});
		
	})
	// Post a new post (Access at POST http://(host)[:(port)]/api/posts)
	.put(paramProcessor.posts.put, function(req, res){

		databaseUtils.posts.put(req.body)
			.then(function(result){
				
				if (result.rowsAffected > 0) {

					if(result.rowsAffected > 0) {
							return res.status(201).json({postID: result.recordSet[0].postID});
						} else {
							return res.sendStatus(202);
						}

				} else {
					return res.sendStatus(409);
				}
			})
			.catch(function(err){

				if(err.status){
					return res.sendStatus(err.status);
				}
				return res.sendStatus(500);
			});
	});


// Routes for postDetail API
router.route('/:postID')
	// Get 1 post's detailed infos (Access at GET http://(host)[:(port)]/api/posts/(postID)[?[isDetailed=(isDetailed)]])
	.get(paramProcessor.posts.postDetail.get, function(req, res) {

		databaseUtils.posts.postDetail.get(req.params)
			.then(function(result){

				if (result.recordSet.length > 0) {

					// If the requester is user, only allow showing hidden infos if he is requesting his own posts' details
					if(req.authorization.role == configs.roles.user && req.authorization.userID != result.recordSet[0].creatorID) {
						req.query.isDetailed = false;
					}

					// If isDetailed flag is not setted, remove hidden infos
					if(!req.query.isDetailed) {
						delete result.recordSet[0].creatorID;
						delete result.recordSet[0].updatorID;
						delete result.recordSet[0].creatorName;
						delete result.recordSet[0].updatorName;
					}

					return res.json(result.recordSet[0]);
				} else {
					return res.status(404).send({message: 'Invalid ID'});
				}
			})
			.catch(function(err){

				if(err.status) {
					return res.sendStatus(err.status);
				}
				return res.sendStatus(500);
			});
	})
	// Edit 1 post (Access at POST http://(host)[:(port)]/api/posts/(postID))
	.patch(authenticator.validatePostCreator, paramProcessor.posts.postDetail.patch, function(req, res){

		databaseUtils.posts.postDetail.patch(req.body)
			.then(function(result){

				if(result.rowsAffected > 0) {
					return res.sendStatus(200);
				} else {
					return res.sendStatus(202);
				}
			})
			.catch(function(err){
				
				if (err.status) {
					return res.sendStatus(err.status);
				}

				return res.sendStatus(500);
			});

	})
	// Delete 1 post (Access at DELETE http://(host)[:(port)]/api/posts/(postID))
	.delete(authenticator.validatePostCreator, paramProcessor.posts.postDetail.delete, function(req, res){

		databaseUtils.posts.postDetail.delete(req.params)
			.then(function(result){

				if(result.rowsAffected > 0) {

					return res.sendStatus(200);
				} else {
					return res.sendStatus(202);
				}
			})
			.catch(function(err){

				if (err.status) {
					return res.sendStatus(err.status);
				}

				return res.sendStatus(500);
			});
	});


module.exports = router;