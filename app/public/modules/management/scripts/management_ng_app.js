'use strict';

// Management page angular app module

var houseMart = angular.module('HouseMart', [
	'ngAnimate',
	'ui.bootstrap',
	'ui.router',
	'zumba.angular-waypoints',
	'HouseMart.PostLoaderControllers',
	'HouseMart.NewPostControllers'
]);

houseMart.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/posts');

	$stateProvider
		.state('posts', {
			url: "/posts",
			templateUrl: "/assets/modules/postLoader/templates/postLoader.html",
			controller: 'PostLoaderController as PostLoaderController'
		})
		.state('posts.postDetail', {
			url: "/{postID:int}",
			parent: 'posts',
			templateUrl: "/assets/templates/postEditor.html",
			controller: 'PostEditorController as PostEditorController'
		})
		.state('account', {
			url: "/account",
			templateUrl: "/assets/modules/management/templates/accountSettings.html",
			controller: 'AccountController as AccountController'
		})
		.state('users', {
			url: "/users",
			templateUrl: "/assets/modules/management/templates/userManagement.html",
			controller: 'UserController as UserController'
		});
})

houseMart.run(function($rootScope) {

	$rootScope.$on('$stateChangeSuccess', function() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	});
})

houseMart.controller('MainController', function($window){
	this.location = {
		path: $window.location.pathname
	};
});


// ===========================

houseMart.controller('AccountController', function($scope){
	
	$scope.MainController.currentTab = 'account';
});

houseMart.controller('UserController', function($scope){

	$scope.MainController.currentTab = 'users';
});
