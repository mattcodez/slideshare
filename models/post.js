'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	title: { type: String },
	photos: {type: Array},
	created: { type: Date , default: Date.now } 
};

var postSchema = new Schema(fields);

module.exports = mongoose.model('Post', postSchema);