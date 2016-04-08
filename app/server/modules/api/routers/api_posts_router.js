// api_posts_router.js

// BASE SETUP
// ================================================

var express 	= require('express');

// Middlewares
var authenticator	= require(makeRootPath('app/server/shared/middlewares/authenticator.js')),
	databaseUtils	= require(makeRootPath('app/server/shared/middlewares/databaseUtils.js'));

var router		= express.Router();


// ROUTING
// ================================================

// Register middleware for authorization
router.use(authenticator.authorize);

// Routes for posts API
router.route('/')
	// Get/search posts (Access at GET http://(host)[:(port)]/api/posts[?[creatorID=(creatorID)][&][province=(province)][&][district=(district)][&][minPrice=(minPrice)][&][maxPrice=(maxPrice)][&][minArea=(minArea)][&][maxArea=(maxArea)][&][isDetailed=(isDetailed)]])
	.get(function(req, res) {

		// Parse isDetailed param
		if(req.query.isDetailed) {
			req.query.isDetailed = (req.query.isDetailed.toUpperCase() === 'TRUE');
		} else {
			req.query.isDetailed = false;
		}

		// Check authorization to see whether the requester is allowed to see detailed posts' infos
		// Admin is allowed by default, so there is no need for checking
		switch (req.authorization.role) {
			case configs.roles.user:

				// If the requester is requesting their own posts' details, then allow. If not, set isDetailed to false
				if(req.query.creatorID && req.query.creatorID == req.authorization.userID) {
					break;
				}

			// If requester is a guest, set isDetailed to false
			case configs.roles.guest:

				req.query.isDetailed = false;
				break;
		}

		databaseUtils.posts.get(req.query)
			.then(function(result){
				res.json(result.recordSet);
			})
			.catch(function(err){
				if(err.status){
					res.sendStatus(err.status);
				}
				res.sendStatus(500);
			});
		
	})
	// Post a new post (Access at POST http://(host)[:(port)]/api/posts)
	.put(function(req, res){

		// Guest is not allowed to post new post
		if (req.authorization.role == configs.roles.guest) {
			res.sendStatus(401);
		} else {

			// Check to see whether required params are presented
			if (req.body.address && req.body.district && req.body.province && req.body.description && req.body.type) {

				// Mark time of creation
				req.body.dateCreate = new Date().toUTCString();
				req.body.dateUpdate = req.body.dateCreate;
				// Mark creator ID
				req.body.creatorID = req.authorization.userID;
				req.body.updatorID = req.authorization.userID;

				databaseUtils.posts.put(req.body)
					.then(function(result){
						
						if (result.rowsAffected > 0) {
							res.sendStatus(201);
						} else {
							res.sendStatus(409);
						}
					})
					.catch(function(err){

						if(err.status){
							res.sendStatus(err.status);
						}
						res.sendStatus(500);
					});
			} else {
				res.sendStatus(501);
			}
		}
	});


// Routes for postDetail API
router.route('/:postID')
	// Get 1 post's detailed infos (Access at GET http://(host)[:(port)]/api/posts/(postID)[?[isDetailed=(isDetailed)]])
	.get(function(req, res) {

		// Parse isDetailed param
		if(req.query.isDetailed) {
			req.query.isDetailed = (req.query.isDetailed.toUpperCase() === 'TRUE');
		}

		// Check authorization to see whether the requester is allowed to see detailed posts' infos
		// Admin is allowed by default, so there is no need for checking
		// User is checked later
		if (req.authorization.role == configs.roles.guest) {
			req.query.isDetailed = false;
		}

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

					res.json(result.recordSet[0]);
				} else {
					res.status(404).send({message: 'Invalid ID'});
				}
			})
			.catch(function(err){

				if(err.status) {
					res.sendStatus(err.status);
				}
				res.sendStatus(500);
			});
	})
	// Edit 1 post (Access at POST http://(host)[:(port)]/api/posts/(postID))
	.patch(authenticator.validatePostCreator, function(req, res){

		// Check to see whether all required params are presenting
		if (req.body.address && req.body.district && req.body.province && req.body.description && req.body.type) {

				// Get post ID
				req.body.postID = req.params.postID;
				// Record updating time
				req.body.dateUpdate = new Date().toUTCString();
				// Record updator ID
				req.body.updatorID = req.authorization.userID;

				databaseUtils.posts.postDetail.patch(req.body)
				.then(function(result){

					if(result.rowsAffected > 0) {
						res.sendStatus(200);
					} else {
						res.sendStatus(400);
					}
				})
				.catch(function(err){
					
					if (err.status) {
						res.sendStatus(err.status);
					}

					res.sendStatus(500);
				});

			} else {
				res.sendStatus(501);
			}
	})
	// Delete 1 post (Access at DELETE http://(host)[:(port)]/api/posts/(postID))
	.delete(authenticator.validatePostCreator, function(req, res){

		databaseUtils.posts.postDetail.delete(req.params)
			.then(function(result){

				if(result.rowsAffected > 0) {

					res.sendStatus(200);
				} else {
					res.sendStatus(400);
				}
			})
			.catch(function(err){

				if (err.status) {
					res.sendStatus(err.status);
				}

				res.sendStatus(500);
			});
	});


module.exports = router;