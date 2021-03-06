const Post = require("../models/Post");

// Get all of a user's posts
const getAllPosts = async (req, res) => {
  let posts = [];
  try {
    posts = await Post.find({postOwner: req.user._id});
  } catch (err) {
    console.log(err);
  }
  res.render("posts", {
    user: req.user,
    title: "Posts",
    posts
  });
};

// Create a new post
const createPost = async (req, res) => {
  try {
    const newPost = new Post({
      postTitle: req.body.postTitle,
      postContent: req.body.postContent,
      postOwner: req.user._id
    });
    await newPost.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect("/posts");
};

// Update a post
const updatePost = async (req, res) => {
  let updateObj = {};
  try {
    const post = await Post.findById(req.params.postID);
    if (req.body.modified_title !== post.postTitle) {
      updateObj.postTitle = req.body.modified_title;
    }
    if (req.body.modified_message !== post.postContent) {
      updateObj.postContent = req.body.modified_message;
    }
    if (updateObj) {
      await Post.findByIdAndUpdate(req.params.postID, {$set: updateObj});
    }
  } catch (err) {
    console.log(err);
  }
  res.redirect("/posts");
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.postID);
  } catch (err) {
    console.log(err);
  }
  res.redirect("/posts");
};

module.exports = {
  getAllPosts, 
  createPost, 
  updatePost, 
  deletePost
};
