'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var categories = require('../../app/controllers/categories');
	var jobs = require('../../app/controllers/jobs');
	// Categories Routes
	app.route('/categories')
		.get(categories.list)
		.post(users.requiresLogin, categories.create);

	app.route('/categories/:categoryId')
		.get(categories.read)
		.put(users.requiresLogin, categories.hasAuthorization, categories.update)
		.delete(users.requiresLogin, categories.hasAuthorization, categories.delete);

	app.route('/categories/:categoryId/Jobs')
		.get(users.requiresLogin, categories.jobsByCategory)
		.post(users.requiresLogin, categories.createjobsByCategory);

	app.route('/categories/:categoryId/Job/:jobId')
		.put(categories.updatejobsbyCategory);
		// .post(users.requiresLogin, categories.create);		

	// Finish by binding the Category middleware
	app.param('categoryId', categories.categoryByID);
};