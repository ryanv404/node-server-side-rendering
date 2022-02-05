const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../controllers/authController");
const {
  getAllPosts, 
  createPost, 
  updatePost, 
  deletePost
} = require('../controllers/postController');

router.get("/", ensureAuthenticated, getAllPosts);
router.post("/", ensureAuthenticated, createPost);
router.put("/:postID", ensureAuthenticated, updatePost);
router.delete("/:postID", ensureAuthenticated, deletePost);

module.exports = router;
