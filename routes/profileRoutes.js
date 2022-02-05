const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../controllers/authController");
const {
  getProfile, 
  updateProfile, 
  deleteProfile
} = require("../controllers/profileController");

router.route("/")
  .get(ensureAuthenticated, getProfile)
  .put(ensureAuthenticated, updateProfile)
  .delete(ensureAuthenticated, deleteProfile);

module.exports = router;
