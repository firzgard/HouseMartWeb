var houseMart = angular.module('HouseMart', ['ui.bootstrap']);

houseMart.controller('MainController', function($scope){
	$scope.templates = {
		header: 'assets/modules/headerBar/templates/headerBar.html'
	};
});

houseMart.controller('ResultPanelController', function($scope){
	$scope.test = 22;
});
