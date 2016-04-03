'use strict';

// RESTful client for angular modules

var restServices = angular.module('RestServices', ['ngResource']);

restServices.factory('Post', ['$resource', function($resource){

	return $resource('api/posts', {}, {
		get: {method: 'GET', isArray: true, withCredentials: true, responseType: 'json'}
	});
}]);