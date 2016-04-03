'use strict';

// postLoader angular controller module

angular.module('HouseMart').controller('PostLoaderController', ['$scope', 'Post', function($scope, Post){

	$scope.posts = Post.get();
	$scope.paginator = {
		itemsPerPage: 10,
		orderProp: 'dateUpdate',
		orderOptions: ['area', 'price', 'dateUpdate', 'dateCreate']
	};
}]);