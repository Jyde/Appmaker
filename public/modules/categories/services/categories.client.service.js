'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
	function($resource) {
		return $resource('categories/:categoryId', { categoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('categories').factory('jobCategories', ['$resource',
	function($resource) {
		return $resource('categories/:categoryId/Jobs', { categoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);