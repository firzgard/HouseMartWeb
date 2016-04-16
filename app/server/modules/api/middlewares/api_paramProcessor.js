module.exports = {
	posts: {
		get: function(req, res, next){

			var preparedParams = {};

			// Check unrequired params
			{
				if(typeof req.query.getAuthorizedPosts !== 'undefined') {
					if (req.query.getAuthorizedPosts.toUpperCase() === 'TRUE') {
						switch (req.authorization.role) {
							case configs.roles.admin:
								break;
							case configs.roles.user:
								preparedParams.creatorID = req.authorization.userID;
								break;
							case configs.roles.guest:
								return res.sendStatus(403);
								break;
						}
					}
				}
				if(typeof req.query.creatorID !== 'undefined') {
					req.query.creatorID = Number.parseInt(req.query.creatorID, 10);
					if(Number.isNaN(req.query.creatorID)) {
						return res.sendStatus(400);
					} else {
						switch (req.authorization.role) {
							case configs.roles.user:
								if (req.query.creatorID !== req.authorization.userID) {
									return res.sendStatus(403);
									break;
								}

							case configs.roles.admin:
								preparedParams.creatorID = req.query.creatorID;
								break;
						}
					}
				}
				if(typeof req.query.districtID !== 'undefined') {
					preparedParams.districtID = Number.parseInt(req.query.districtID, 10);
					if(Number.isNaN(preparedParams.districtID)) {
						return res.sendStatus(400);
					}
				}
				if(typeof req.query.provinceID !== 'undefined') {
					preparedParams.provinceID = Number.parseInt(req.query.provinceID, 10);
					if(Number.isNaN(preparedParams.provinceID)) {
						return res.sendStatus(400);
					}
				}
				if(typeof req.query.minPrice !== 'undefined') {
					preparedParams.minPrice = Number.parseFloat(req.query.minPrice);
					if(Number.isNaN(preparedParams.minPrice)) {
						return res.sendStatus(400);
					}
				}
				if(typeof req.query.maxPrice !== 'undefined') {
					preparedParams.maxPrice = Number.parseFloat(req.query.maxPrice);
					if(Number.isNaN(preparedParams.maxPrice)) {
						return res.sendStatus(400);
					}
				}
				if(typeof req.query.minArea !== 'undefined') {
					preparedParams.minArea = Number.parseFloat(req.query.minArea);
					if(Number.isNaN(preparedParams.minArea)) {
						return res.sendStatus(400);
					}
				}
				if(typeof req.query.maxArea !== 'undefined') {
					preparedParams.maxArea = Number.parseFloat(req.query.maxArea);
					if(Number.isNaN(preparedParams.maxArea)) {
						return res.sendStatus(400);
					}
				}
			}
			
			// Parse isDetailed param
			if(typeof req.query.isDetailed !== 'undefined') {
				preparedParams.isDetailed = (req.query.isDetailed.toUpperCase() === 'TRUE');
			} else {
				preparedParams.isDetailed = false;
			}

			// Check authorization to see whether the requester is allowed to see detailed posts' infos
			// Admin is allowed by default, so there is no need for checking
			switch (req.authorization.role) {
				case configs.roles.user:

					// If the requester is requesting their own posts' details, then allow. If not, set isDetailed to false
					if(typeof preparedParams.creatorID !== 'undefined' && preparedParams.creatorID === req.authorization.userID) {
						break;
					}

				// If requester is a guest, set isDetailed to false
				case configs.roles.guest:

					preparedParams.isDetailed = false;
					break;
			}

			req.query = preparedParams;
		
			return next();
		},
		put: function(req, res, next){
			
			var preparedParams = {};

			// Guest is not allowed to post new post
			if (req.authorization.role == configs.roles.guest) {
				return res.sendStatus(401);
			}

			// Check whether all required params are presented and is in correct type
			{
				if(typeof req.body.address === 'undefined' || req.body.address.length > 150) {
					return res.sendStatus(400);
				} else {
					preparedParams.address = req.body.address;
				}

				if(typeof req.body.districtID === 'undefined') {
					return res.sendStatus(400);
				} else {
					preparedParams.districtID = Number.parseInt(req.body.districtID, 10);
					if (Number.isNaN(preparedParams.districtID)) {
						return res.sendStatus(400);
					}
				}

				if(typeof req.body.title === 'undefined' || req.body.title.length > 50) {
					return res.sendStatus(400);
				}  else {
					preparedParams.title = req.body.title;
				}
				
				if(typeof req.body.type === 'undefined') {
					return res.sendStatus(400);
				} else {
					preparedParams.type = Number.parseInt(req.body.type, 10);
					if (Number.isNaN(preparedParams.type)) {
						return res.sendStatus(400);
					}
				}
			}

			// Check unrequired params
			{
				if(typeof req.body.ownerName !== 'undefined') {
					if (req.body.ownerName.length > 60) {
						return res.sendStatus(400);
					} else {
						preparedParams.ownerName = req.body.ownerName;
					}
				}
					
				if(typeof req.body.phone !== 'undefined') {
					if(req.body.phone.length > 20) {
						return res.sendStatus(400);
					} else {
						preparedParams.phone = req.body.phone;
					}
				}

				if(typeof req.body.description !== 'undefined') {
					if(req.body.description.length > 1000) {
						return res.sendStatus(400);
					} else {
						preparedParams.description = req.body.description;
					}
				}

				if(typeof req.body.area !== 'undefined') {
					preparedParams.area = Number.parseFloat(req.body.area);
					if(Number.isNaN(preparedParams.area)) {
						return res.sendStatus(400);
					}
				}

				if(typeof req.body.price !== 'undefined') {
					preparedParams.price = Number.parseFloat(req.body.price);
					if(Number.isNaN(preparedParams.price)) {
						return res.sendStatus(400);
					}
				}

				if(typeof req.body.latitude !== 'undefined') {
					preparedParams.latitude = Number.parseFloat(req.body.latitude);
					if(Number.isNaN(preparedParams.latitude)) {
						return res.sendStatus(400);
					}
				}

				if(typeof req.body.longitude !== 'undefined') {
					preparedParams.longitude = Number.parseFloat(req.body.longitude);
					if(Number.isNaN(preparedParams.longitude)) {
						return res.sendStatus(400);
					}
				}

				if (typeof req.body.isPublic  !== 'undefined') {
					// Only admin is allowed to set isPublic flag
					if (req.authorization.role === configs.roles.admin) {
						preparedParams.isPublic = (req.query.isPublic.toUpperCase() === 'TRUE')
					} else {
						preparedParams.isPublic = false;
					}
				} else {
					preparedParams.isPublic = false;
				}
			}

			// Mark time of creation
			preparedParams.dateCreate = new Date().toUTCString();
			preparedParams.dateUpdate = preparedParams.dateCreate;
			// Mark creator ID
			preparedParams.creatorID = req.authorization.userID;
			preparedParams.updatorID = req.authorization.userID;

			req.body = preparedParams;

			return next();
		},
		postDetail: {
			get: function(req, res, next){

				// Check required params
				req.params.postID = Number.parseInt(req.params.postID, 10);
				if(Number.isNaN(req.params.postID)) {
					return res.sendStatus(400);
				}

				// Parse isDetailed param
				if(typeof req.query.isDetailed !== 'undefined') {
					req.query.isDetailed = (req.query.isDetailed.toUpperCase() === 'TRUE');
				}

				// Check authorization to see whether the requester is allowed to see detailed posts' infos
				// Admin is allowed by default, guest is not allowed
				// User is checked later when creatorID has been retrieved from database
				if (req.authorization.role == configs.roles.guest) {
					req.query.isDetailed = false;
				}

				return next();
			},
			patch: function(req, res, next){

				var preparedParams = {};

				// Prevent empty update
				if ( Object.keys(req.body).length < 1) {
					return res.sendStatus(400);
				}

				// Check required params
				{
					preparedParams.postID = Number.parseInt(req.params.postID, 10);
					if(Number.isNaN(preparedParams.postID)) {
						return res.sendStatus(400);
					}
				}

				// Check unrequired params
				{
					if(typeof req.body.ownerName !== 'undefined') {
						if (req.body.ownerName.length > 60) {
							return res.sendStatus(400);
						} else {
							preparedParams.ownerName = req.body.ownerName;
						}
					}

					if(typeof req.body.address !== 'undefined') {
						if (req.body.address.length > 150) {
							return res.sendStatus(400);
						} else {
							preparedParams.address = req.body.address;
						}
					}


					if(typeof req.body.districtID !== 'undefined') {
						preparedParams.districtID = Number.parseInt(req.body.districtID, 10);
						if (Number.isNaN(preparedParams.districtID)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.title !== 'undefined') {
						if (req.body.title.length > 50) {
							return res.sendStatus(400);
						} else {
							preparedParams.title = req.body.title;
						}
					}

					if(typeof req.body.type !== 'undefined') {
						preparedParams.type = Number.parseInt(req.body.type, 10);
						if (Number.isNaN(preparedParams.type)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.description !== 'undefined') {
						if(req.body.description.length > 1000) {
							return res.sendStatus(400);
						} else {
							preparedParams.description = req.body.description;
						}
					}

					if(typeof req.body.phone !== 'undefined') {
						if(req.body.phone.length > 20) {
							return res.sendStatus(400);
						} else {
							preparedParams.phone = req.body.phone;
						}
					}

					if(typeof req.body.area !== 'undefined') {
						preparedParams.area = Number.parseFloat(req.body.area);
						if(Number.isNaN(preparedParams.area)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.price !== 'undefined') {
						preparedParams.price = Number.parseFloat(req.body.price);
						if(Number.isNaN(preparedParams.price)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.latitude !== 'undefined') {
						preparedParams.latitude = Number.parseFloat(req.body.latitude);
						if(Number.isNaN(preparedParams.latitude)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.longitude !== 'undefined') {
						preparedParams.longitude = Number.parseFloat(req.body.longitude);
						if(Number.isNaN(preparedParams.longitude)) {
							return res.sendStatus(400);
						}
					}

					if(typeof req.body.image1 !== 'undefined') {
						if (req.body.image1.toUpperCase() === 'TRUE') {
							preparedParams.image1 = '/assets/shared/imgs/posts/' + preparedParams.postID + '/image1.jpeg';
						} else if (req.body.image1.toUpperCase() === 'FALSE') {
							preparedParams.image1 = null;
						}
					}

					if(typeof req.body.image2 !== 'undefined') {
						if (req.body.image2.toUpperCase() === 'TRUE') {
							preparedParams.image2 = '/assets/shared/imgs/posts/' + preparedParams.postID + '/image2.jpeg';
						} else if (req.body.image2.toUpperCase() === 'FALSE') {
							preparedParams.image2 = null;
						}
						
					}

					if(typeof req.body.image3 !== 'undefined') {
						if (req.body.image3.toUpperCase() === 'TRUE') {
							preparedParams.image3 = '/assets/shared/imgs/posts/' + preparedParams.postID + '/image3.jpeg';
						} else if (req.body.image3.toUpperCase() === 'FALSE'){
							preparedParams.image3 = null;
						}
					}

					if (typeof req.body.isPublic !== 'undefined') {
						// Only admin is allowed to set isPublic flag
						if (req.authorization.role === configs.roles.admin) {

							if(req.body.isPublic.toUpperCase() === 'TRUE') {
								preparedParams.isPublic = true;
							} else if(req.body.isPublic.toUpperCase() === 'FALSE') {
								preparedParams.isPublic = false;
							}
						} else {
							preparedParams.isPublic = false;
						}
					}
				}
					
				// Record updating time
				preparedParams.dateUpdate = new Date().toUTCString();
				// Record updator ID
				preparedParams.updatorID = req.authorization.userID;

				req.body = preparedParams;

				return next();
			},
			delete: function(req, res, next){

				// Check required params
				req.params.postID = Number.parseInt(req.params.postID, 10);
				if(Number.isNaN(req.params.postID)) {
					return res.sendStatus(400);
				}

				return next();
			},
		}
	}
}