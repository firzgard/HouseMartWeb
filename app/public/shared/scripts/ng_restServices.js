'use strict';

// RESTful client for angular modules

var apiServices = angular.module('HouseMart.APIServices', ['ngResource']);

apiServices.factory('$APIService', ['$resource', '$httpParamSerializerJQLike', function($resource, $httpParamSerializerJQLike){

	var transformFormData = function(data, headersGetter) {
		return $httpParamSerializerJQLike(data);
	};

	return  {
		posts: $resource('api/posts', {}, {
			get: {method: 'GET', isArray: true, withCredentials: true, responseType: 'json'},
			getAuthorizedPosts: {method: 'GET', isArray: true, params: {getAuthorizedPosts: true, isDetailed: true}, withCredentials: true, responseType: 'json'},
			put: {method: 'PUT', isArray: false, withCredentials: true, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, transformRequest: transformFormData, responseType: 'json'}
		}),
		postDetails: $resource('api/posts/:postID', {}, {
			get: {method: 'GET', isArray: false, withCredentials: true, responseType: 'json'}
		}),
		provinces: $resource('api/provinces', {}, {
			get: {method: 'GET', isArray: true, withCredentials: true, responseType: 'json'}
		}),
		districts: $resource('api/districts', {}, {
			get: {method: 'GET', isArray: true, withCredentials: true, responseType: 'json'}
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
		},
		getAuthorizedPosts: function() {
			posts = $APIService.posts.getAuthorizedPosts();
			return posts;
		},
		refreshPosts: function() {
			posts = $APIService.posts.get();
			return posts;
		},
		put: function(params, success, error) {
			return $APIService.posts.put(params, success, error);
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

apiServices.factory('$provinceService', ['$APIService', function($APIService){

	var provinces = null;

	return {
		getProvinces: function() {
			if (!provinces) {
				provinces = $APIService.provinces.get();	
			}

			return provinces;
		},
		refreshProvinces: function() {
			provinces = $APIService.provinces.get();
			return provinces;
		}
	};
}]);

apiServices.factory('$districtService', ['$APIService', function($APIService){

	var districts = null;

	return {
		getDistricts: function() {
			if (!districts) {
				districts = $APIService.districts.get();	
			}

			return districts;
		},
		refreshDistricts: function() {
			districts = $APIService.districts.get();
			return districts;
		}
	};
}]);