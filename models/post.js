'use strict';
var shortId = require('shortid');

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
  _id: {
    type: String,
    unique: true,
    'default': shortId.generate
  },
	title: { type: String },
	photos: { type:[String]},
	created: { type: Date , default: Date.now }
};

var postSchema = new Schema(fields);

module.exports = mongoose.model('Post', postSchema);
