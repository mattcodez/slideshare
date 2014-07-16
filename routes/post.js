'use strict';

var util = require('util');
var Hashids = require("hashids");
var hashids = new Hashids(
  "this is my salt",
  4,
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'
);

function getPostId(hash){
  var hash = (hash || '').toUpperCase();
  return hashids.decrypt(hash);
}

module.exports = function(app) {
  // Module dependencies.
  var mongoose = require('mongoose'),
      Post = mongoose.models.Post,
      api = {};

  // ALL
  api.posts = function (req, res) {
    Post.find(function(err, posts) {
      if (err) {
        res.json(500, err);
      } else {
        res.json({posts: posts});
      }
    });
  };

  // GET
  api.post = function (req, res) {
	 //Have to use parseInt as Mongoose or MongoDB doesn't try very hard to cast "2" to 2
    Post.findOne({ '_id': parseInt(getPostId(req.params.hash), 10) }, function(err, post) {
      if (err) {
        res.json(404, err);
      } else {
        res.json(200, {post: post});
      }
    });
  };

  // POST
  api.addPost = function (req, res) {
    var post;

    if(typeof req.body.post == 'undefined'){
      return res.json(500, {message: 'post is undefined'});
    }

    post = new Post(req.body.post);

    post.save(function (err) {
      if (!err) {
        console.log("created post");
        return res.json(201, post);
      } else {
         return res.json(500, err);
      }
    });

  };

  // PUT
  api.editPost = function (req, res) {
    var id = getPostId(req.params.hash);
	 
    Post.findById(~~id, function (err, post) {
		if (!post) {
			return res.json(500, err);
		}
		
		var newPhoto = req.files.photos.name;
		if (newPhoto){
			post.photos.addToSet(newPhoto);
		}
		
console.dir(post);
      return post.save(function (err) {
        if (!err) {
          console.log("updated post");
          return res.json(200, post);
        } else {
         return res.json(500, err);
        }
      });
    });

  };

  // DELETE
  api.deletePost = function (req, res) {
    var id = req.params.id;
    Post.findById(id, function (err, post) {
      return post.remove(function (err) {
        if (!err) {
          console.log("removed post");
          return res.send(204);
        } else {
          console.log(err);
          return res.json(500, err);
        }
      });
    });

  };


  app.get('/api/posts', api.posts);
  app.get('/api/post/:hash', api.post);
  app.post('/api/post', api.addPost);
  app.put('/api/post/:hash', api.editPost);
  app.delete('/api/post/:hash', api.deletePost);
};
