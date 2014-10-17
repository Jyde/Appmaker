'use strict';

//Comments service used to communicate Comments REST endpoints
angular.module('comments').factory('Comments', ['$resource',
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