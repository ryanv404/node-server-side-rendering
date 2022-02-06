const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');

const getUsersHome = (req, res) => {
  res.render('users', {title: "Users API"});
}

const getAllUsers = async (req, res) => {
  const users = await User.find({role: 'user'})
    .select('first_name last_name email role isVerified name');

  res.status(StatusCodes.OK).json({users});
};

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id}).select('-password');
    if (!user) {
      return res.json(`No user with the id: ${req.params.id}.`);
    }
    res.status(StatusCodes.OK).json({user});
  } catch (error) {
    if (error.name === "CastError") return res.json(`${req.params.id} is an invalid user ID`);
    return res.json(`No user with the id: ${req.params.id}.`);
  }

};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({user: req.user});
};

const updateUser = async (req, res) => {
  const {email, name} = req.body;
  if (!email || !name) {
    req.flash("error_msg", "Please provide all values.");
    return res.redirect("/");
  }

  // Update the user in the DB with new values
  const user = await User.findOne({_id: req.user.userId});
  user.email = email;
  user.name = name;
  await user.save();

  res.status(StatusCodes.OK).json({});
};

module.exports = {
  getUsersHome, 
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
};