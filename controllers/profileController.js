const User = require("../models/User");

// Get user's profile
const getProfile = async (req, res) => {
  const user = await User.findOne({username: req.user.username});
  res.render("profile", {
    user: user,
    title: "Profile"
  });
};

// TODO: Update user's profile
const updateProfile = async (req, res) => {
  let updateObj = {};
  try {
    const user = await User.findOne(req.params.username);
    if (req.body.modified_firstName !== user.firstName) {
      updateObj.firstName = req.body.modified_firstName;
    }
    if (req.body.modified_lastName !== user.lastName) {
      updateObj.lastName = req.body.modified_lastName;
    }
    if (updateObj && (req.user.username === req.params.username)) {
      await User.findByIdAndUpdate(user._id, {$set: updateObj});
    }
  } catch (err) {
    console.log(err);
  }
  res.redirect("/profile");
};

// TODO: Delete user's profile
const deleteProfile = async (req, res) => {
  try {
    await User.findOne(req.params.username);
  } catch (err) {
    console.log(err);
  }
  res.redirect("/logout");
};

module.exports = {
  getProfile, 
  updateProfile, 
  deleteProfile
};
