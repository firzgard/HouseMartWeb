'use strict';

// newPost angular controller module

var newPostControllers = angular.module('HouseMart.NewPostControllers', ['HouseMart.APIServices']);

newPostControllers.controller('NewPostController', ['$uibModal', function ($uibModal) {

	this.$uibModal = $uibModal;

	this.createPost = function () {

		var modalInstance = $uibModal.open({
			templateUrl: '/assets/modules/newPost/templates/newPost.html',
			controller: 'NewPostModalController as NewPostModalController',
			size: 'lg',
			resolve: {
				items: function () {
					return;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {

		});
	};
}]);

newPostControllers.controller('NewPostModalController', ['$uibModalInstance', '$postService', '$provinceService', '$districtService', '$log',
	function ($uibModalInstance, $postService, $provinceService, $districtService) {

		this.provinces = $provinceService.getProvinces();
		this.districts = $districtService.getDistricts();
		this.newPost = {
			type: 1
		};

		this.submit = function () {

			$postService.put(this.newPost, function(value, responseHeaders){
				$uibModalInstance.close();

			}), function(httpResponse) {
				this.putError = true;
			};
		};

		this.cancel = function () {
			$uibModalInstance.dismiss('Cancel');
		};
	}]);