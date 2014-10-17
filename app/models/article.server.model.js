'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	count : {
		type: Number,
		default: '1'
	},
	upvotes: {type: Number, default: 0},

	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});


ArticleSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Article', ArticleSchema);