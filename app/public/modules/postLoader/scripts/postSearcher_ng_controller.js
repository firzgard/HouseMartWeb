'use strict';

// postSearcher angular controller module

var postSearcherControllers = angular.module('HouseMart.PostSearcherControllers', [
	'HouseMart.APIServices'
]);

postSearcherControllers.controller('PostSearcherController',
	function($scope, $provinceService, $districtService){

		var thisScope = this;

		thisScope.open = false;

		$scope.PostLoaderController.postFilter = {
			provinceID: 9999
		};

		thisScope.provinces = $provinceService.getProvinces();
		thisScope.districts = $districtService.getDistricts();
	});