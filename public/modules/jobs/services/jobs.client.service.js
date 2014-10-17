'use strict';

//Jobs service used to communicate Jobs REST endpoints
// angular.module('jobs').factory('Jobs', ['$resource',
// 	function($resource) {
// 		return $resource('jobs/:jobId', 
// 			{ 
// 				jobId: '@_id'
// 			},

// 			{
// 			update: {
// 				method: 'PUT'
// 			}
// 		});
// 	}
// ]);

// Testing new service
angular.module('jobs').factory('Jobs', ['$resource',
 function($resource) {
  return $resource('jobs/:jobId', 
			{ 
				jobId: '@_id'
			},

			{
			update: {
				method: 'PUT'
			}
		});

}]);

angular.module('comments').factory('JobComments', ['$resource',
	function($resource) {
		return $resource('jobs/:jobId/comments/:commentId', 
			{ commentId: '@_id', jobId:'@job'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);