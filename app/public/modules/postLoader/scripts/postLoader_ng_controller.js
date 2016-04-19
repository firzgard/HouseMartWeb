'use strict';

// postLoader angular controller module

var postLoaderControllers = angular.module('HouseMart.PostLoaderControllers', [
	'uiGmapgoogle-maps',
	'angularUtils.directives.dirPagination',
	'dcbImgFallback',
	'HouseMart.PostSearcherControllers',
	'HouseMart.PostEditorControllers',
	'HouseMart.APIServices',
	'HouseMart.EmptyToEndFilter',
	'HouseMart.SearchPostFilter'
]);

postLoaderControllers.config(['uiGmapGoogleMapApiProvider',function(uiGmapGoogleMapApiProvider) {
	 uiGmapGoogleMapApiProvider.configure({
	 	key: 'AIzaSyBFIj2SYhMGjpb5wiMjh0NKdBd5UgO1zaU',
		libraries: 'weather,geometry,places,visualization'
	});
}])


postLoaderControllers.controller('PostLoaderController',
	function($postService, $scope){

		this.showDetail = false;

		var thisScope = this;

		$scope.MainController.currentTab = 'posts';

		if($scope.MainController.location.path.toUpperCase() == '/MANAGEMENT') {
			thisScope.posts = $postService.getAuthorizedPosts();
		} else {
			thisScope.posts = $postService.getPosts();
		}

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

	});

postLoaderControllers.controller('PostDetailController',
	function($scope, $state, $stateParams, $postDetailService, uiGmapGoogleMapApi){

		var thisScope = this;

		$scope.PostLoaderController.showDetail = true;
		
		thisScope.displayImg = 1;

		thisScope.post = $postDetailService.getPost($stateParams.postID, function(value, responseHeaders){

			if (thisScope.post.longitude && thisScope.post.latitude) {

				uiGmapGoogleMapApi.then(function(maps) {

					maps.visualRefresh = true;

					thisScope.map = {
						center: { latitude: thisScope.post.latitude, longitude: thisScope.post.longitude },
						zoom: 18
					};

					thisScope.marker = {
						id: 'houseMarker',
						coords: { latitude: thisScope.post.latitude, longitude: thisScope.post.longitude },
						options: {
							animation: 1
						}
					};
				});
			}
		});

		this.goBack = function() {
			$scope.PostLoaderController.showDetail = false;
			$state.go('^');
		}
	});