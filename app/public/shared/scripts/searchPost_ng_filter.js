'use strict';

// postSearcher angular controller module

var searchPostFilter = angular.module('HouseMart.SearchPostFilter', [
	'HouseMart.APIServices'
]);

var validateItem = function(item, searchParams) {

	if (searchParams.provinceID && searchParams.provinceID != 9999) {
		if(item.provinceID !== searchParams.provinceID) {
			return false;
		}
	}

	if (searchParams.districtID) {
		if(item.districtID !== searchParams.districtID) {
			return false;
		}
	}

	if (searchParams.minPrice) {
		if(item.price < searchParams.minPrice) {
			return false;
		}
	}

	if (searchParams.maxPrice) {
		if(item.price > searchParams.maxPrice) {
			return false;
		}
	}

	if (searchParams.minArea) {
		if(item.area < searchParams.minArea) {
			return false;
		}
	}

	if (searchParams.maxArea) {
		if(item.area > searchParams.maxArea) {
			return false;
		}
	}

	return true;
};

searchPostFilter.filter('searchPost',
	function(){
		return function(items, searchParams) {

			if(searchParams) {
				var result = [];

				for (var i=0, l=items.length; i<l; i++) {

					if (validateItem(items[i], searchParams)) {
						result.push(items[i]);
					}
				}

				return result;
			}
			return items
		}
	});