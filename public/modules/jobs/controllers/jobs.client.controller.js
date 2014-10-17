'use strict';

// Jobs controller
angular.module('jobs').controller('JobsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Jobs', 'Categories', 'Comments', 'JobComments',
    function($scope, $state, $stateParams, $location, Authentication, Jobs, Categories, Comments, JobComments) {
        $scope.authentication = Authentication;
        $scope.addComments = false;
        // Sets the categories options to false since it's going to recieve a 
        $scope.categories = false;
        $scope.getCategories = function() {
            // retieves all the categories and their Id's
            $scope.categories = Categories.query();
        };

        $scope.commentSection = function() {
            $scope.addComments = true;
        };



        $scope.levels = ['Experienced', 'Entry Level', 'Graduate', 'Internships', 'Consultant', 'Other'];

        // Create new Job
        $scope.create = function() {
            // Create new Job object
            // Instantiate a new resource class var job = Jobs();
            var job = new Jobs($scope.job);
            job.image = $scope.image;

            // Redirect after save
            job.$save(function(response) {
                //			    $scope.jobimg = response.image;
                $location.path('jobs/' + response._id);

                $scope.job = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            return true;
        };

        // Upvoting a Job post
        $scope.incrementUpvotes = function(job) {
            job.upvotes += 1;
        };
        $scope.incrementDownvotes = function(job) {
            job.downvotes += 1;
        };



        // handle Add comments to post to comment database
        // Create new Comment
        $scope.addComment = function() {
            // Create new Comment object
            var comment = new Comments({
                body: this.name,
                job: $stateParams.jobId
            });
            console.log($stateParams.jobId);
            // Redirect after save
            comment.$save(function(response) {
                var jobId = $stateParams.jobId;
                //$location.path('jobs/'+jobId);
                //$state.reload();
                $scope.comments.push(response);
                // Clear form fields
                $scope.name = '';
                $scope.addComments = false;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.image = '';
        // Processing upload of file
        $scope.onFileSelect = function($files) {
            $scope.files = $files;
            console.log($scope.files);

            var reader = new FileReader();

            reader.onload = function(e) {
                $scope.image = e.target.result;
                console.log($scope.image);
            };

            reader.readAsDataURL($scope.files[0]);
        };

        //   var fileInput = document.getElementById('fileInput');
        //     var fileDisplayArea = document.getElementById('fileDisplayArea');

        //     fileInput.addEventListener('change', function(e) {
        //     			var files = e.target.files;
        // 					if(files && files[0] !== null) {
        // 						var reader = new FileReader();
        // 						reader.onload = function(e) {
        // 									console.log(e);
        // 									console.log(reader.result);
        // 						var img = new Image();
        // 						img.src = reader.result;
        // 						$scope.image = reader.result;
        // 						fileDisplayArea.appendChild(img);
        // 						}
        // 				reader.readAsDataURL(files[0]);
        // 				}	
        // 			});


        // Remove existing Job
        $scope.remove = function(job) {
            if (job) {
                job.$remove();

                for (var i in $scope.jobs) {
                    if ($scope.jobs[i] === job) {
                        $scope.jobs.splice(i, 1);
                    }
                }
            } else {
                $scope.job.$remove(function() {
                    $location.path('jobs');
                });
            }
        };

        // Update existing Job
        $scope.update = function() {
            var job = $scope.job;

            job.$update(function() {
                // $location.path('jobs/' + job._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Jobs
        $scope.find = function() {
            $scope.jobs = Jobs.query();
            console.log($scope.jobs);
        };

        // Find existing Job
        $scope.findOne = function() {
            $scope.job = Jobs.get({
                jobId: $stateParams.jobId,
            });
        };

        $scope.findComments = function() {
            $scope.comments = JobComments.query({
                jobId: $stateParams.jobId
            });
        };

  //       $scope.jobUpdate = function(size, selectedJob) {
		// 	var modalInstance = $modal.open({
		// 		templateUrl: 'modules/jobs/views/edit-job.client.view.html',
		// 		controller: function($scope, $modalInstance, job) {
		// 			$scope.job = job;
		// 			$scope.ok = function() {
		// 					$modalInstance.close($scope.job);
						
		// 			};
		// 			$scope.cancel = function() {
		// 				$modalInstance.dismiss('cancel');
		// 			};
		// 		},
		// 		size: size,
		// 		resolve: {
		// 			job: function() {
		// 				return selectedJob;
		// 			}
		// 		}
		// 	});

		// 	modalInstance.result.then(function (selectedItem) {
		// 		$scope.selected = selectedItem;
		// 	}, function() {
		// 		$log.info('Modal dismissed at:' + new Date());
		// 	});
		// };


        //End of function 
    }
]);
