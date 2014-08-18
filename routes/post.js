'use strict';

var util = require('util');

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
    Post.findOne({ '_id': req.params._id}, function(err, post) {
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
    Post.findById(req.params._id, function (err, post) {
  		if (!post) {
  			return res.json(500, err);
  		}

  		var newPhoto = req.files.photos.name;
  		if (newPhoto){
  			post.photos.addToSet(newPhoto);
        app._photoUpdate && app._photoUpdate(post._id, post.photos);
  		}

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
  app.get('/api/post/:_id', api.post);
  app.post('/api/post', api.addPost);
  app.put('/api/post/:_id', api.editPost);
  app.delete('/api/post/:_id', api.deletePost);
};
