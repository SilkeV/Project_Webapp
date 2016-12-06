var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

router.use(function(req, res, next) {
  if(req.method === "GET") {
    //continue to the next middleware or request handler
    return next();
  }

  if(!req.isAuthenticated()) {
    //user not authenticated, redirect to login page
    return res.redirect('/#login');
  }

//user authenticated continue to next middleware or handler
  return next();
});

router.route('/posts')
    //return all posts
    .get(function(req, res) {
      Post.find(function(err, data) {
        if(err) {
          return res.send(500, err);
        }
        return res.send(data);
      });
    })

    .post(function(req, res) {
      var post = new Post();
      post.text = req.body.text;
      post.username = req.body.created_by;
      post.save(function(err, post) {
        if(err) {
          return res.send(500, err);
        }
        return res.json(post);
      });
    });

router.route('/posts/:id')
  //returns a partical posts
  .get(function(req, res) {
    Post.findById(req.params.id, function(err, post) {
      if(err) {
        res.send(err);
      }
      res.json(post);
    });
  })

  //update existing post
  .put(function(req, res) {
    Post.findById(req.params.id, function(err, post) {
      if(err) {
        res.send(err);
      }
      post.username = req.bod.created_by;
      post.text = req.body.text;
      post.save(function(err, post) {
        if(err) {
          res.send(err);
        }
        res.json(post);
      });
    })
  })

  //Delete existing post
  .delete(function(req, res) {
    Post.remove({
      _id: req.params.id
    }, function(err) {
      if(err) {
        res.send(err);
      }
      res.json("deleted: (");
    });
  });

module.exports = router;
