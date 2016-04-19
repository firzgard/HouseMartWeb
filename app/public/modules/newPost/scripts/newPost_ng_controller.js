'use strict';

// newPost angular controller module

var newPostControllers = angular.module('HouseMart.NewPostControllers', [
	'uiGmapgoogle-maps',
	'frapontillo.bootstrap-switch',
	'HouseMart.APIServices'
]);

newPostControllers.config(['uiGmapGoogleMapApiProvider',function(uiGmapGoogleMapApiProvider) {
	 uiGmapGoogleMapApiProvider.configure({
	 	key: 'AIzaSyBFIj2SYhMGjpb5wiMjh0NKdBd5UgO1zaU',
		libraries: 'weather,geometry,places,visualization'
	});
}])

newPostControllers.controller('NewPostController', function ($scope, $postService, $uibModal, uiGmapGoogleMapApi) {

	this.$uibModal = $uibModal;

	this.createPost = function () {

		var modalInstance = $uibModal.open({
			templateUrl: '/assets/templates/newPost.html',
			controller: 'NewPostModalController as NewPostModalController',
			size: 'lg',
			resolve: {
				items: function () {
					return;
				}
			}
		});

		modalInstance.result.then(function () {
			$scope.PostLoaderController.alert = 'New post created successfully!!';
			$scope.PostLoaderController.posts = $postService.refreshAuthorizedPosts();
		});
	};
});

newPostControllers.controller('NewPostModalController',
	function ($scope, $uibModalInstance, $postService, $provinceService, $districtService, uiGmapGoogleMapApi) {

		var thisScope = this;

		thisScope.provinces = $provinceService.getProvinces();
		thisScope.districts = $districtService.getDistricts();

		thisScope.newPost = {
			type: 1,
			isPublic: false
		};

		uiGmapGoogleMapApi.then(function(maps) {

			maps.visualRefresh = true;

			thisScope.map = {
				center: { latitude: 13.7878915, longitude: 109.3186302 },
				events: {
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
				},
				zoom: 4
			};
		});

		this.submit = function () {

			if (this.marker) {
				this.newPost.longitude = this.marker.coords.longitude;
				this.newPost.latitude = this.marker.coords.latitude;
			}

			$postService.put(this.newPost, function(value, responseHeaders){
				$uibModalInstance.close();

			}, function(httpResponse) {
				thisScope.putError = true;
			});
		};

		this.cancel = function () {
			$uibModalInstance.dismiss('Cancel');
		};
	});