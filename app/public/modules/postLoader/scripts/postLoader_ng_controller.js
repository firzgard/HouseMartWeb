'use strict';

// postLoader angular controller module

var postLoaderControllers = angular.module('PostLoaderControllers', []);

postLoaderControllers.controller('PostLoaderController', ['$scope', '$postService',
	function($scope, $postService){

		$scope.posts = $postService.getPosts();
		$scope.paginator = {
			itemsPerPage: 10,
			orderProp: 'dateUpdate',
			orderOptions: ['area', 'price', 'dateUpdate', 'dateCreate']
		};
		$scope.showDetail = false;

	}]);

postLoaderControllers.controller('PostDetailController', ['$scope', '$state', '$stateParams', '$postDetailService',
	function($scope, $state, $stateParams, $postDetailService){

		$scope.$parent.showDetail = true;
		$scope.postID = $postDetailService.getPostDetail($stateParams.postID);

		$scope.goBack = function() {
			$scope.$parent.showDetail = false;
			$state.go('main');
		}
	}]);