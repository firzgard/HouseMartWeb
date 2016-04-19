'use strict';

// postEditor angular controller module

var postEditorControllers = angular.module('HouseMart.PostEditorControllers', [
	'uiGmapgoogle-maps',
	'dcbImgFallback',
	'HouseMart.APIServices',
]);

postEditorControllers.controller('PostEditorController',
	function($scope, $state, $stateParams, $postService, $postDetailService, $provinceService, $districtService, $uibModal, uiGmapGoogleMapApi){

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
				districtID: thisScope.post.districtID,
				isPublic: thisScope.post.isPublic
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
			$state.go('^');
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
			thisScope.editedPost.isPublic = thisScope.post.isPublic;

			if (thisScope.post.longitude && thisScope.post.latitude) {

				thisScope.map = {
					center: { latitude: thisScope.post.latitude, longitude: thisScope.post.longitude },
					zoom: 18
				};

				thisScope.marker.coords = { latitude: thisScope.post.latitude, longitude: thisScope.post.longitude };
			}
		}

		this.save = function() {

			var modalInstance = $uibModal.open({
				templateUrl: '/assets/modules/postLoader/templates/confirmationModal.html',
				controller: 'ConfirmationModalController as ConfirmationModalController',
				size: 'sm',
				windowClass: 'confirmation-modal',
				resolve: {
					title: function() {
						return 'You are about to change this post!!';
					}
				}
			});

			modalInstance.result.then(function () {

				if (thisScope.marker) {
					thisScope.editedPost.longitude = thisScope.marker.coords.longitude;
					thisScope.editedPost.latitude = thisScope.marker.coords.latitude;
				}

				$postDetailService.updatePost(thisScope.editedPost, function(value, responseHeaders){
					thisScope.updated = true;

					thisScope.post = $postDetailService.getPostForEdit($stateParams.postID);
					$scope.PostLoaderController.posts = $postService.refreshAuthorizedPosts();

				}, function(httpResponse) {
					thisScope.updateError = true;
				});
			});
		};

		this.delete = function() {

			var modalInstance = $uibModal.open({
				templateUrl: '/assets/modules/postLoader/templates/confirmationModal.html',
				controller: 'ConfirmationModalController as ConfirmationModalController',
				size: 'sm',
				windowClass: 'confirmation-modal',
				resolve: {
					title: function() {
						return 'You are about to delete this post!!';
					}
				}
			});

			modalInstance.result.then(function () {

				$postDetailService.deletePost($stateParams.postID, function(value, responseHeaders){

					$scope.PostLoaderController.posts = $postService.refreshAuthorizedPosts();
					$scope.PostLoaderController.alert = 'Post deleted successfully!!'

					return thisScope.goBack();

				}, function(httpResponse) {
					thisScope.updateError = true;
				});
			});
		};

		this.takeDown = function() {

			var modalInstance = $uibModal.open({
				templateUrl: '/assets/modules/postLoader/templates/confirmationModal.html',
				controller: 'ConfirmationModalController as ConfirmationModalController',
				size: 'sm',
				windowClass: 'confirmation-modal',
				resolve: {
					title: function() {
						return 'You are about to take this post down!!';
					}
				}
			});

			modalInstance.result.then(function () {

				$postDetailService.updatePost({postID: $stateParams.postID, isPublic: false}, function(value, responseHeaders){

					thisScope.updated = true;
					thisScope.post.isPublic = false;
					$scope.PostLoaderController.posts = $postService.refreshAuthorizedPosts();

				}, function(httpResponse) {
					thisScope.updateError = true;
				});
			});
		};
	});

postEditorControllers.controller('ConfirmationModalController',
	function ($uibModalInstance, title) {

		var thisScope = this;

		thisScope.title = title;

		this.ok = function () {
			$uibModalInstance.close();
		};

		this.cancel = function () {
			$uibModalInstance.dismiss('Cancel');
		};
	});