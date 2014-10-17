'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Comment = mongoose.model('Comment'),
	Job = mongoose.model('Job'),
	_ = require('lodash');

/**
 * Create a Comment
 */
exports.create = function(req, res) {
	var comment = new Comment(req.body);
	// console.log('comment', req);
	comment.user = req.user;
	comment.job = req.job;
	// console.log(comment.job);
	comment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
				req.job.comments.push(comment);
				req.job.save(function(err){
					if(!err)
						res.jsonp(comment);
				});
				
		}
	});
};

/**
 * Show the current Comment
 */
exports.read = function(req, res) {
	res.jsonp(req.comment);
};

/**
 * Update a Comment
 */
exports.update = function(req, res) {
	var comment = req.comment ;

	comment = _.extend(comment , req.body);

	comment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comment);
		}
	});
};

/**
 * Delete an Comment
 */
exports.delete = function(req, res) {
	var comment = req.comment ;
	var job = req.job;
	if(job && job.comments)
	{
		var i = job.comments.indexOf(comment._id);

		job.comments.splice(i,1);

	}

		comment.remove(function (err){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if(job)
			job.save();
			res.jsonp(comment);
		}});
	// });
};

/**
 * List of Comments by Job ID
 */
// exports.jobComments = function(req, res, next, id) {
// 	Job.findById(id).populate('user', 'displayName').populate('comments', 'body').exec(function(err, comment) {
// 		if (err) return next(err);
// 		if (! comment) return next(new Error('Failed to load comments ' + id));
// 		req.comment = comment ;
// 		next();
// 	});
// };





exports.list = function(req, res) { Comment.find({job:req.job}).sort('-created').populate('user', 'displayName').exec(function(err, comments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comments);
		}
	});
};
/**
 * List of  on current job
 */


/**
 * Comment middleware
 */
exports.commentByID = function(req, res, next, id) { Comment.findById(id).populate('user', 'displayName').exec(function(err, comment) {
		if (err) return next(err);
		if (! comment) return next(new Error('Failed to load Comment ' + id));
		req.comment = comment ;
		next();
	});
};

/**
 * Comment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.comment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};