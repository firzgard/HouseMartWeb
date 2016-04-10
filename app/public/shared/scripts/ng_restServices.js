'use strict';

// RESTful client for angular modules

var apiServices = angular.module('HouseMart.APIServices', ['ngResource']);

apiServices.factory('$APIService', ['$resource', function($resource){

	return  {
		posts: $resource('api/posts', {}, {
			get: {method: 'GET', isArray: true, withCredentials: true, responseType: 'json'}
		}),
		postDetails: $resource('api/posts/:postID', {}, {
			get: {method: 'GET', isArray: false, withCredentials: true, responseType: 'json'}
		}),
	};
}]);

apiServices.factory('$postService', ['$APIService', function($APIService){
	var posts = null;

	return {
		getPosts: function() {
			if (!posts) {
				posts = $APIService.posts.get();	
			}

			return posts;
		}
	};
}]);

apiServices.factory('$postDetailService', ['$APIService', function($APIService){
	var postDetails = [];

	return {
		getPostDetail: function(postID) {
			postDetails.forEach(function(postDetail){
				if (postDetail.postID == postID) {
					return postDetail;
				}
			});

			var postDetail = $APIService.postDetails.get({postID: postID});
			postDetails.push(postDetail);
			return postDetail;
		}
	};
}]);