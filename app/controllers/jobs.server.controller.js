'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Job = mongoose.model('Job'),
	Comment = mongoose.model('Comment'),
	Category = mongoose.model('Category'),
	_ = require('lodash');

/**
 * Create a Job
 */
exports.create = function(req, res) {
	var job = new Job(req.body);
	job.user = req.user;

	job.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * Show the current Job
 */
exports.read = function(req, res) {
	res.jsonp(req.job);
};

/**
 * Update a Job
 */
exports.update = function(req, res) {
	var job = req.job ;

	job = _.extend(job , req.body);

	job.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * Delete an Job
 */
exports.delete = function(req, res) {
	var job = req.job ;

	job.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * List of Jobs
 */
exports.list = function(req, res) { 
	Job.find().sort('-created').populate('user', 'displayName').populate('comments', 'body').populate('category', 'name').exec(function(err, jobs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobs);
		}
	});
};

exports.voting =  function(req, res, next) {
    var job = new Job(req.body);

    req.job.vote.upvote(function(err, vote){
        if (err) { return next(err); }
        res.json(job);
    });
};

// To search for a paticular user activity
exports.getByuserId = function(req, res){
	Job.where('user').equals(req.user._id).exec(
		function(err, data){
			if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(data);
		}

		}
	);

};

// Handle user search
// exports.search = function(req, res){
// 	var q = req.param('query');
// 	Job.find({category:q}, function(err,data){

// 		res.jsonp(data);
// 	});
// };
// Search v 2.0
exports.search = function(req,res){	

	var $or = {$or:[]};
	var checkQuery = function(){
		if (req.query.q&&req.query.q.length >0){
			$or.$or.push({title : new RegExp(req.query.q, 'i')});
		}
		if (req.query.category && req.query.category.length > 1){
			$or.$or.push({category: new RegExp(req.query.category)});
		}
		if(req.query.location && req.query.location.length>1)
		{
			$or.$or.push({location:new RegExp(req.query.location)});
		}
		if(req.query.level && req.query.level.length>1)
		{
			$or.$or.push({level:new RegExp(req.query.level)});
		}
	};
	checkQuery();
	Job.find($or).exec(function(err, jobs){
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobs);
			// console.log(req.body);
		}
	});
};

// Function that will get posts from a particular job
// exports.getComments = function(req, res, next) {
//   var comment = new Comment(req.body);
//   comment.job = req.job;

//   comment.save(function(err, comment){
//     if(err){ return next(err); }

//     req.job.comments.push(comment);
//     req.job.save(function(err, job) {
//       if(err){ return next(err); }

//       res.jsonp(comment);
//     });
//   });
// };


/**
 * Job middleware
 */
exports.jobByID = function(req, res, next, id) { Job.findById(id).populate('user', 'displayName').populate('category', 'choice').exec(function(err, job) {
		if (err) return next(err);
		if (! job) return next(new Error('Failed to load Job ' + id));
		req.job = job ;
		next();
	});
};

/**
 * Job authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.job.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};