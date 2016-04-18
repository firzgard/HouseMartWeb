'use strict';

// RESTful client for angular modules

var apiServices = angular.module('HouseMart.APIServices', ['ngResource']);

apiServices.factory('$APIService', function($resource, $httpParamSerializer, $httpParamSerializerJQLike){

	var transformFormData = function(data, headersGetter) {
		var test1 = $httpParamSerializerJQLike(data);
		var test2 = $httpParamSerializer(data);
		return $httpParamSerializerJQLike(data);
	};

	return  {
		posts: $resource('api/posts', {}, {
			get: {method: 'GET', isArray: true, withCredentials: true, responseType: 'json'},
			getAuthorizedPosts: {method: 'GET', isArray: true, params: {getAuthorizedPosts: true, isDetailed: true}, withCredentials: true, responseType: 'json'},
			put: {method: 'PUT', isArray: false, withCredentials: true, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, transformRequest: transformFormData, responseType: 'json'}
		}),
		postDetails: $resource('api/posts/:postID', {postID: '@postID'}, {
			get: {method: 'GET', isArray: false, withCredentials: true, responseType: 'json'},
			patch: {method: 'PATCH', withCredentials: true, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, transformRequest: transformFormData}
		}),
		provinces: $resource('api/provinces', {}, {
			get: {method: 'GET', isArray: true, withCredentials: true, responseType: 'json'}
		}),
		districts: $resource('api/districts', {}, {
			get: {method: 'GET', isArray: true, withCredentials: true, responseType: 'json'}
		}),
	};
});

apiServices.factory('$postService', function($APIService){

	var posts = null;

	return {
		getPosts: function(success, error) {
			if (!posts) {
				posts = $APIService.posts.get({}, success, error);
			}

			return posts;
		},
		getAuthorizedPosts: function(success, error) {
			if (!posts) {
				posts = $APIService.posts.getAuthorizedPosts({}, success, error);
			}

			return posts;
		},
		refreshPosts: function(success, error) {
			posts = $APIService.posts.get({}, success, error);
			return posts;
		},
		refreshAuthorizedPosts: function(success, error) {
			posts = $APIService.posts.getAuthorizedPosts({}, success, error);
			return posts;
		},
		put: function(params, success, error) {
			return $APIService.posts.put(params, success, error);
		}
	};
});

apiServices.factory('$postDetailService', function($APIService){

	return {
		getPost: function(postID, success, error) {

			var postDetail = $APIService.postDetails.get({postID: postID}, success, error);
			return postDetail;
		},
		getPostForEdit: function(postID, success, error) {

			var postDetail = $APIService.postDetails.get({
				postID: postID,
				isDetailed: true
			}, success, error);
			return postDetail;
		},
		updatePost: function(params, success, error) {
			return $APIService.postDetails.patch(params, success, error);
		},
		deletePost: function(postID, success, error) {
			return $APIService.postDetails.delete({postID: postID}, success, error);
		}
	};
});

apiServices.factory('$provinceService', function($APIService){

	var provinces = null;

	return {
		getProvinces: function() {
			if (!provinces) {
				provinces = $APIService.provinces.get({}, function() {
					provinces.push({
						provinceID: 9999,
						provinceName: '======'
					})
					return;
				});	
			}

			return provinces;
		},
		refreshProvinces: function() {
			provinces = $APIService.provinces.get({}, function() {
				provinces.push({
					provinceID: '',
					provinceName: ''
				})
				return;
			});	
			return provinces;
		}
	};
});

apiServices.factory('$districtService', function($APIService){

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
});