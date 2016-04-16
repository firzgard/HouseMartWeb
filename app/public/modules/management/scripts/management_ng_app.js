'use strict';

// Management page angular app module

var houseMart = angular.module('HouseMart', [
	'ui.bootstrap',
	'ui.router',
	'zumba.angular-waypoints',
	'HouseMart.PostLoaderControllers',
	'HouseMart.NewPostControllers'
]);

houseMart.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/posts');

	$stateProvider
		.state('main', {
			url: "/posts",
			templateUrl: "/assets/modules/postLoader/templates/postLoader.html",
			controller: 'PostLoaderController as PostLoaderController'
		})
		.state('main.postDetail', {
			url: "/{postID:int}",
			parent: 'main',
			templateUrl: "/assets/templates/postEditor.html",
			controller: 'PostEditorController as PostEditorController'
		});
})

houseMart.controller('MainController', function($window){
	this.location = {
		path: $window.location.pathname
	};
});