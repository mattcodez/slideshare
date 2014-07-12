'use strict';
var Hashids = require("hashids");
var hashids = new Hashids(
  "this is my salt",
  0,
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'
);

var pureautoinc = require('mongoose-pureautoinc');

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	title: { type: String },
	photos: {type: Array},
	created: { type: Date , default: Date.now }
};

var postSchema = new Schema(fields);

postSchema.plugin(pureautoinc.plugin, {
    model: 'Post',
    field: '_id',
	 start: 0
});

postSchema.set('toJSON', {virtuals: true});

postSchema.virtual('hash').get(function(){console.dir(this);
  return hashids.encryptHex(this._id);
});

postSchema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.id;
}

module.exports = mongoose.model('Post', postSchema);