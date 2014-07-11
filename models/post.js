'use strict';
var Hashids = require("hashids");
var hashids = new Hashids(
  "this is my salt",
  0,
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'
);

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	title: { type: String },
	photos: {type: Array},
	created: { type: Date , default: Date.now } 
};

var postSchema = new Schema(fields);

postSchema.set('toJSON', {virtuals: true});

postSchema.virtual('hash').get(function(){
  return hashids.encryptHex(this._id);
});

module.exports = mongoose.model('Post', postSchema);