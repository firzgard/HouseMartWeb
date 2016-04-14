angular.module('ui.bootstrap.demo').controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {

	$scope.items = ['item1', 'item2', 'item3'];

	$scope.open = function (size) {

		var modalInstance = $uibModal.open({
			templateUrl: '/assets/modules/newPost/templates/newPost.html',
			controller: 'NewPostController',
			size: size,
			resolve: {
				items: function () {
					return $scope.items;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		});
	};

	$scope.toggleAnimation = function () {
		$scope.animationsEnabled = !$scope.animationsEnabled;
	};

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('ui.bootstrap.demo').controller('NewPostController', function ($scope, $uibModalInstance, items) {

	$scope.items = items;
	$scope.selected = {
		item: $scope.items[0]
	};

	$scope.ok = function () {
		$uibModalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('Cancel');
	};
});