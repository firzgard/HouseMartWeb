module.exports = {
	posts: {
		get: function(req, res, next){

			// Check unrequired params
			{
				if(typeof req.query.creatorID !== 'undefined') {
					req.query.creatorID = Number.parseInt(req.query.creatorID, 10);
					if(Number.isNaN(req.query.creatorID)) {
						return res.sendStatus(400);
					}
				}
				if(typeof req.query.districtID !== 'undefined') {
					req.query.districtID = Number.parseInt(req.query.districtID, 10);
					if(Number.isNaN(req.query.districtID)) {
						return res.sendStatus(400);
					}
				}
				if(typeof req.query.minPrice !== 'undefined') {
					req.query.minPrice = Number.parseFloat(req.query.minPrice);
					if(Number.isNaN(req.query.minPrice)) {
						return res.sendStatus(400);
					}
				}
				if(typeof req.query.maxPrice !== 'undefined') {
					req.query.maxPrice = Number.parseFloat(req.query.maxPrice);
					if(Number.isNaN(req.query.maxPrice)) {
						return res.sendStatus(400);
					}
				}
				if(typeof req.query.minArea !== 'undefined') {
					req.query.minArea = Number.parseFloat(req.query.minArea);
					if(Number.isNaN(req.query.minArea)) {
						return res.sendStatus(400);
					}
				}
				if(typeof req.query.maxArea !== 'undefined') {
					req.query.maxArea = Number.parseFloat(req.query.maxArea);
					if(Number.isNaN(req.query.maxArea)) {
						return res.sendStatus(400);
					}
				}
			}
			
			// Parse isDetailed param
			if(typeof req.query.isDetailed !== 'undefined') {
				req.query.isDetailed = (req.query.isDetailed.toUpperCase() === 'TRUE');
			} else {
				req.query.isDetailed = false;
			}

			// Check authorization to see whether the requester is allowed to see detailed posts' infos
			// Admin is allowed by default, so there is no need for checking
			switch (req.authorization.role) {
				case configs.roles.user:

					// If the requester is requesting their own posts' details, then allow. If not, set isDetailed to false
					if(typeof req.query.creatorID !== 'undefined' && req.query.creatorID === req.authorization.userID) {
						break;
					}

				// If requester is a guest, set isDetailed to false
				case configs.roles.guest:

					req.query.isDetailed = false;
					break;
			}
		
			next();
		},
		put: function(req, res, next){
			
			// Guest is not allowed to post new post
			if (req.authorization.role == configs.roles.guest) {
				res.sendStatus(401);
			}

			// Check whether all required params are presented and is in correct type
			{
				if(typeof req.body.address === 'undefined') {
					return res.sendStatus(400);
				}

				if(typeof req.body.districtID === 'undefined') {
					return res.sendStatus(400);
				} else {
					req.body.districtID = Number.parseInt(req.body.districtID, 10);
					if (Number.isNaN(req.query.districtID)) {
						return res.sendStatus(400);
					}
				}

				if(typeof req.body.description === 'undefined') {
					return res.sendStatus(400);
				}
				
				if(typeof req.body.type === 'undefined') {
					return res.sendStatus(400);
				} else {
					req.body.type = Number.parseInt(req.body.type, 10);
					if (Number.isNaN(req.query.type)) {
						return res.sendStatus(400);
					}
				}
			}

			// Check unrequired params
			{
				if(typeof req.body.phone !== 'undefined') {
					req.body.phone = Number.parseInt(req.body.phone, 10);
					if(Number.isNaN(req.body.phone)) {
						return res.sendStatus(400);
					}
				}

				if(typeof req.body.area !== 'undefined') {
					req.body.area = Number.parseFloat(req.body.area);
					if(Number.isNaN(req.body.area)) {
						return res.sendStatus(400);
					}
				}

				if(typeof req.body.price !== 'undefined') {
					req.body.price = Number.parseFloat(req.body.price);
					if(Number.isNaN(req.body.price)) {
						return res.sendStatus(400);
					}
				}

				if(typeof req.body.latitude !== 'undefined') {
					req.body.latitude = Number.parseFloat(req.body.latitude);
					if(Number.isNaN(req.body.latitude)) {
						return res.sendStatus(400);
					}
				}

				if(typeof req.body.longitude !== 'undefined') {
					req.body.longitude = Number.parseFloat(req.body.longitude);
					if(Number.isNaN(req.body.longitude)) {
						return res.sendStatus(400);
					}
				}

				if (typeof req.body.isPublic  !== 'undefined') {
					// Only admin is allowed to set isPublic flag
					if (req.authorization.role === configs.roles.admin) {
						if(typeof req.body.isPublic !== 'boolean') {
							return res.sendStatus(400);
						}
					} else {
						req.body.isPublic = false;
					}
				} else {
					req.body.isPublic = false;
				}
			}

			// Mark time of creation
			req.body.dateCreate = new Date().toUTCString();
			req.body.dateUpdate = req.body.dateCreate;
			// Mark creator ID
			req.body.creatorID = req.authorization.userID;
			req.body.updatorID = req.authorization.userID;

			next();
		},
		postDetail: {
			get: function(req, res, next){

				// Check required params
				req.params.postID = Number.parseInt(req.params.postID, 10);
				if(Number.isNaN(req.params.postID)) {
					return res.sendStatus(400);
				}

				// Parse isDetailed param
				if(req.query.isDetailed) {
					req.query.isDetailed = (req.query.isDetailed.toUpperCase() === 'TRUE');
				}

				// Check authorization to see whether the requester is allowed to see detailed posts' infos
				// Admin is allowed by default, guest is not allowed
				// User is checked later when creatorID has been retrieved from database
				if (req.authorization.role == configs.roles.guest) {
					req.query.isDetailed = false;
				}

				next();
			},
			patch: function(req, res, next){

				// Prevent empty update
				if ( Object.keys(req.body).length < 1) {
					return res.sendStatus(400);
				}

				// Check required params
				{
					req.body.postID = Number.parseInt(req.params.postID, 10);
					if(Number.isNaN(req.body.postID)) {
						return res.sendStatus(400);
					}
				}

				// Check unrequired params
				{
					if(typeof req.body.districtID !== 'undefined') {
						req.body.districtID = Number.parseInt(req.body.districtID, 10);
						if (Number.isNaN(req.query.districtID)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.type !== 'undefined') {
						req.body.type = Number.parseInt(req.body.type, 10);
						if (Number.isNaN(req.query.type)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.phone !== 'undefined') {
						req.body.phone = Number.parseInt(req.body.phone, 10);
						if(Number.isNaN(req.body.phone)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.area !== 'undefined') {
						req.body.area = Number.parseFloat(req.body.area);
						if(Number.isNaN(req.body.area)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.price !== 'undefined') {
						req.body.price = Number.parseFloat(req.body.price);
						if(Number.isNaN(req.body.price)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.latitude !== 'undefined') {
						req.body.latitude = Number.parseFloat(req.body.latitude);
						if(Number.isNaN(req.body.latitude)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.longitude !== 'undefined') {
						req.body.longitude = Number.parseFloat(req.body.longitude);
						if(Number.isNaN(req.body.longitude)) {
							return res.sendStatus(400);
						}
					}

					if (typeof req.body.isPublic  !== 'undefined') {
						// Only admin is allowed to set isPublic flag
						if (req.authorization.role === configs.roles.admin) {
							if(typeof req.body.isPublic !== 'boolean') {
								return res.sendStatus(400);
							}
						} else {
							req.body.isPublic = false;
						}
					} else {
						req.body.isPublic = false;
					}
				}
					
				// Record updating time
				req.body.dateUpdate = new Date().toUTCString();
				// Record updator ID
				req.body.updatorID = req.authorization.userID;

				next();
			},
			delete: function(req, res, next){

				// Check required params
				req.params.postID = Number.parseInt(req.params.postID, 10);
				if(Number.isNaN(req.params.postID)) {
					return res.sendStatus(400);
				}

				next();
			},
		}
	}
}