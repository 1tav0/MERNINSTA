const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const requireLogin = require('../middleware/requireLogin');
const { response } = require('express');

router.get('/allposts', requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name photo")
    .populate("comments.postedBy", "_id name photo")
    .sort('-createdAt')//post created want to be at top not in order that is right now which is at bottom 
    .then(posts => {
      res.json({ posts });
    })
    .catch(err => {
      console.log(err);
    })
})

router.post('/createpost', requireLogin, (req, res) => {
  const { title, body, photo } = req.body;

  if (!title || !body || !photo) {
    return res.status(422).json({ error: "Please add all the fields." });
  }
  req.user.password = undefined; //hide it from the backend
  const post = new Post({
    title, 
    body,
    photo,
    postedBy: req.user
  })

  post.save()
    .then(result => {
      return res.json({ post: result });
    })
    .catch(error => {
      console.log(error);
    })
})

router.get('/myposts', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name photo")
    .populate("comments.postedBy", "_id name photo")
    .then(myposts => {
      res.json({ myposts });
    })
    .catch(err => {
      console.log(err);
    })
})

router.put('/like', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $push: {
      likes: req.user._id
    }
  }, {
    new: true
  })
    .populate("postedBy", "_id name photo")
    .populate("comments.postedBy", "_id name photo")
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      return res.status(422).json({ error: err });
    })
});

router.put('/unlike', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $pull: {
      likes: req.user._id
    }
  }, {
    new: true
  })
    .populate("postedBy", "_id name photo")
    .populate("comments.postedBy", "_id name photo")
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      return res.status(422).json({ error: err });
    })
});

router.put('/comment', requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  }

  Post.findByIdAndUpdate(req.body.postId, {
    $push: {
      comments: comment
    }
  }, {
    new: true
  })
    .populate("postedBy", "_id name photo")
    .populate("comments.postedBy", "_id name photo")
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.status(422).json({ error: err });
    })

});

router.delete('/deletepost/:postid', requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postid })
    .populate("postedBy", "_id name photo")
    .populate("comments.postedBy", "_id name photo")
    .then(post => {
      if (!post) {
        return res.status(422).json({error: "Post not found"})
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post.deleteOne()
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
          })
      } else {
        return res.status(401).json({error: "Unauthorized"})
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    })
})

router.delete('/deletecomment/:commentid', requireLogin, (req, res) => {
  Post.findOneAndUpdate({
    "comments._id": req.params.commentid,
    "comments.postedBy": req.user._id
  }, {
    $pull: {
      comments: {
        _id: req.params.commentid
      }
    }
  }, {
    new:true
  })
  .populate("postedBy", "_id name photo")
  .populate("comments.postedBy", "_id name photo")
  .then(post =>{
    if (!post) {
      return res.status(422).json({ error: "Post not found" });
    }
    res.json(post);
  })
  .catch(err =>{
    conosole.log(err);
    return res.status(422).json({error: "Internal server error"})
  })
})

module.exports = router;