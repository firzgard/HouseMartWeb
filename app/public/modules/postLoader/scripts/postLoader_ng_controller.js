'use strict';

// postLoader angular controller module

var postLoaderControllers = angular.module('HouseMart.PostLoaderControllers', [
	'angularUtils.directives.dirPagination',
	'dcbImgFallback',
	'HouseMart.APIServices',
	'HouseMart.EmptyToEndFilter'
]);

postLoaderControllers.controller('PostLoaderController', ['$postService', '$scope',
	function($postService, $scope){

		$scope.showDetail = false;
		this.posts = $postService.getPosts();
		this.paginator = {
			itemsPerPage: 10,
			orderProp: {
				expression: 'dateUpdate',
				reverse: true
			},
			orderOptions: [
				{
					label: 'Largest Land Area',
					value: {
						expression: 'area',
						reverse: true
					}
				},
				{
					label: 'Smallest Land Area',
					value: {
						expression: 'area',
						reverse: false
					}
				},
				{
					label: 'Highest Price',
					value: {
						expression: 'price',
						reverse: true
					}
				},
				{
					label: 'Lowest Price',
					value: {
						expression: 'price',
						reverse: false
					}
				},
				{
					label: 'Newest Update',
					value: {
						expression: 'dateUpdate',
						reverse: true
					}
				},
				{
					label: 'Oldest Update',
					value: {
						expression: 'dateUpdate',
						reverse: false
					}
				},
				{
					label: 'Newest Post',
					value: {
						expression: 'dateCreate',
						reverse: true
					}
				},
				{
					label: 'Oldest Post',
					value: {
						expression: 'dateCreate',
						reverse: false
					}
				}
			]
		};

	}]);

postLoaderControllers.controller('PostDetailController', ['$scope', '$state', '$stateParams', '$postDetailService',
	function($scope, $state, $stateParams, $postDetailService){

		$scope.$parent.showDetail = true;
		this.postDetail = $postDetailService.getPostDetail($stateParams.postID);

		this.goBack = function() {
			$scope.$parent.showDetail = false;
			$state.go('main');
		}
	}]);