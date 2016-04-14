'use strict';

// Homepage angular app module

var houseMart = angular.module('HouseMart', [
	'ui.bootstrap',
	'ui.router',
	'angularUtils.directives.dirPagination',
	'dcbImgFallback' ,
	'HouseMart.PostLoaderControllers',
	'HouseMart.EmptyToEndFilter',
	'HouseMart.APIServices'
]);

houseMart.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('main', {
			url: "/",
			templateUrl: "/assets/modules/postLoader/templates/postLoader.html",
			controller: 'PostLoaderController'
		})
		.state('main.postDetail', {
			url: "posts/{postID:int}",
			parent: 'main',
			templateUrl: "/assets/modules/postLoader/templates/postDetail.html",
			controller: 'PostDetailController'
		});
}])