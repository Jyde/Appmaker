'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var jobs = require('../../app/controllers/jobs');
	var comments = require('../../app/controllers/comments');

	// Jobs Routes
	app.route('/jobs')
		.get(jobs.list)
		.post(users.requiresLogin, jobs.create);

	// Job comments
	// app.route('/jobs/:jobId/comments')
	// 	.get(jobs.getComments);
	// 	.post(jobs.createComment);
	app.route('/jobs/:jobId/upvote')
		.put(jobs.voting);
		

	app.route('/jobs/:jobId')
		.get(jobs.read)
		.put(users.requiresLogin, jobs.hasAuthorization, jobs.update)
		.delete(users.requiresLogin, jobs.hasAuthorization, jobs.delete);

	app.route('/jobs/search/category')
		.get(jobs.search);

	// Finish by binding the Job middleware
	app.param('jobId', jobs.jobByID);
};
