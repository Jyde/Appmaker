'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Job Schema
 */
var JobSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill Job name',
		trim: true
	},
	description: {
		type: String,
		default:'Job Description is not available',
		trim: true
	},
	// Recieves value from select box
	category:{
		type: Schema.ObjectId,
		ref: 'Category',
		required: 'Please select a category'
	}, 
	location: {
		type: String,
		default:'Location is unknown',
		trim:true
	},

	level: {
		type: String,
		trim:true,
		default:'Level is not defined'
	},
	// Rates Job
	votes: {
		upvotes:{
		type: Number,
		default: 0
		},

		downvotes:{
			type: Number,
			default: 0
		}
		// trim: true
	},		
	created: {
		type: Date,
		default: Date.now
	},
	comments:
	[{
		type: Schema.ObjectId,
		ref: 'Comment'
	}],
	deadline: {
		type: Date,
		default: Date.now,
		required: 'YYYY/MM/DD'
	},

	apply:{
		type: String
	},

	image: {
		   type: String,
            trim:true
		   // required: 'Uploaded an image cannot be blank'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

JobSchema.methods.upvote = function(cb) {
  this.votes.upvotes += 1;
  this.votes.save(cb);
};


mongoose.model('Job', JobSchema);