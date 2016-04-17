'use strict';

// postLoader angular controller module

var postLoaderControllers = angular.module('HouseMart.PostLoaderControllers', [
	'uiGmapgoogle-maps',
	'angularUtils.directives.dirPagination',
	'dcbImgFallback',
	'HouseMart.APIServices',
	'HouseMart.EmptyToEndFilter'
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
			$state.go('main');
		}
	});

postLoaderControllers.controller('PostEditorController',
	function($scope, $state, $stateParams, $postService, $postDetailService, $provinceService, $districtService, uiGmapGoogleMapApi){

		var thisScope = this;

		$scope.PostLoaderController.showDetail = true;

		thisScope.provinces = $provinceService.getProvinces();
		thisScope.districts = $districtService.getDistricts();

		thisScope.displayImg = 1;

		thisScope.post = $postDetailService.getPostForEdit($stateParams.postID, function(value, responseHeaders){

			thisScope.editedPost = {
				postID: $stateParams.postID,
				title: thisScope.post.title,
				address: thisScope.post.address,
				ownerName: thisScope.post.ownerName,
				phone: thisScope.post.phone,
				area: thisScope.post.area,
				price: thisScope.post.price,
				description: thisScope.post.description,
				provinceID: thisScope.post.provinceID,
				districtID: thisScope.post.districtID
			}

			uiGmapGoogleMapApi.then(function(maps) {

				maps.visualRefresh = true;

				if (thisScope.post.longitude && thisScope.post.latitude) {

					thisScope.map = {
						center: { latitude: thisScope.post.latitude, longitude: thisScope.post.longitude },
						zoom: 18
					};

					thisScope.marker = {
						id: 'houseMarker',
						coords: { latitude: thisScope.post.latitude, longitude: thisScope.post.longitude },
						options: {
							animation: 1,
							draggable: true
						}
					};
				} else {

					thisScope.map = {
						center: { latitude: 13.7878915, longitude: 109.3186302 },
						zoom: 4
					};
				}
					
				thisScope.map.events = {
					click: function (map, eventName, eventArgs) {

						if (thisScope.marker) {
							thisScope.marker.coords = { latitude: eventArgs[0].latLng.lat(), longitude: eventArgs[0].latLng.lng() };
						} else {

							thisScope.marker = {
								id: 'houseMarker',
								coords: { latitude: eventArgs[0].latLng.lat(), longitude: eventArgs[0].latLng.lng() },
								options: {
									animation: 1,
									draggable: true
								}
							};
						}	

						$scope.$apply()
					}
				};
			});
		});

		this.goBack = function() {
			$scope.PostLoaderController.showDetail = false;
			$state.go('main');
		};

		this.reset = function () {
			thisScope.editedPost.title = thisScope.post.title;
			thisScope.editedPost.address = thisScope.post.address;
			thisScope.editedPost.ownerName = thisScope.post.ownerName;
			thisScope.editedPost.phone = thisScope.post.phone;
			thisScope.editedPost.area = thisScope.post.area;
			thisScope.editedPost.price = thisScope.post.price;
			thisScope.editedPost.description = thisScope.post.description;
			thisScope.editedPost.provinceID = thisScope.post.provinceID;
			thisScope.editedPost.districtID = thisScope.post.districtID;

			if (thisScope.post.longitude && thisScope.post.latitude) {

				thisScope.map = {
					center: { latitude: thisScope.post.latitude, longitude: thisScope.post.longitude },
					zoom: 18
				};

				thisScope.marker.coords = { latitude: thisScope.post.latitude, longitude: thisScope.post.longitude };
			}
		}

		this.save = function() {

			if (thisScope.marker) {
				thisScope.editedPost.longitude = thisScope.marker.coords.longitude;
				thisScope.editedPost.latitude = thisScope.marker.coords.latitude;
			}

			$postDetailService.updatePost(thisScope.editedPost, function(value, responseHeaders){
				thisScope.updated = true;

				$scope.PostLoaderController.posts = $postService.refreshAuthorizedPosts();

			}, function(httpResponse) {
				thisScope.updateError = true;
			});
		};
	});