const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const requireLogin = require('../middleware/requireLogin');

router.get('/user/:userid', requireLogin, (req, res) => {
  User.findOne({ _id: req.params.userid })
    .select("-password")
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "User is not found" });
      }
      Post.find({ postedBy: req.params.userid })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
          if (!posts) {
            return res.status(422).json({ error: "No posts found for user" });
          }
          res.json({ user, posts });
        })
        .catch(error => {
          console.log(error);
          return res.status(422).json({ error: "Error finding posts" });
        })
    })
    .catch(error => {
      console.log(error);
      return res.status(422).json({ error: "Error finding user" });
    })
});


module.exports = router