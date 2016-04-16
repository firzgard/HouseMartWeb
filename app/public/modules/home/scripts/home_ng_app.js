'use strict';

// Homepage angular app module

var houseMart = angular.module('HouseMart', [
	'ui.bootstrap',
	'ui.router',
	'HouseMart.PostLoaderControllers'
]);

houseMart.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('main', {
			url: "/",
			templateUrl: "/assets/modules/postLoader/templates/postLoader.html",
			controller: 'PostLoaderController as PostLoaderController'
		})
		.state('main.postDetail', {
			url: "posts/{postID:int}",
			parent: 'main',
			templateUrl: "/assets/modules/postLoader/templates/postDetail.html",
			controller: 'PostDetailController as PostDetailController'
		});
}])

houseMart.controller('MainController', ['$window', function($window){
	this.location = {
		path: $window.location.pathname
	};
}]);