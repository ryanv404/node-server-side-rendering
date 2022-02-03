const User = require('../models/User');
const crypto = require('crypto');
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} = require('../utils/index');

const showHomepage = (req, res) => {
  res.render('home', {title: "Welcome"});
};

const registerUser = async (req, res) => {
  try {
    const {first_name, last_name, email, password, confirm_pw} = req.body;

    // Check if email address is already in DB
    const alreadyExists = await User.findOne({email});
    if (alreadyExists) {
      req.flash("error_msg", "That email address is already registered.");
      return res.redirect("/");
    }
    
    // Check if retyped password === password
    if (password !== confirm_pw) {
      req.flash("error_msg", "Passwords do not match.")
      return res.redirect("/");
    }

    // First registered user is set to be an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const verificationToken = crypto.randomBytes(40).toString('hex');

    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
      role,
      verificationToken
    });

    // Send verification email to user
    const origin = process.env.BASE_URL;
    
    await sendVerificationEmail({
      name: user.first_name || "there",
      email: user.email,
      verificationToken: user.verificationToken,
      origin,
    });

    req.flash(
      "success_msg",
      "Account created! Please check your email to verify your account."
    );
    return res.redirect("/");

  } catch (error) {
    console.log(error);
    req.flash("error_msg", "There was an error. Please try again later.");
    res.redirect('/');
  }
};

const verifyEmail = async (req, res) => {
  try {
    const {token, email} = req.query;
    const user = await User.findOne({email});

    // Ensure that user exists and that verification token matches
    if (!user || (user.verificationToken !== token)) {
      req.flash("error_msg", "Account verification failed.");
      return res.redirect("/");
    }

    // Set user to verified in the DB
    user.isVerified = true;
    user.verifiedOn = Date.now();
    user.verificationToken = '';
    await user.save();

    req.flash("success_msg", "Your account has been successfully verified. Please log in.");
    return res.redirect("/");

  } catch (error) {
    console.log(error);
    req.flash("error_msg", "There was an error. Please try again later.");
    res.redirect('/');
  }
};

const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    // Ensure user provided both an email and password
    if (!email || !password) {
      req.flash("error_msg", "Please provide both an email and a password.");
      return res.redirect("/");
    }

    // Ensure the user is registered and password is correct
    const user = await User.findOne({email});
    if (!user) {
      req.flash("error_msg", "Invalid credentials");
      return res.redirect("/");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      req.flash("error_msg", "Incorrect password");
      return res.redirect("/");
    }

    // Ensure user has a verified email address
    if (!user.isVerified) {
      req.flash("error_msg", "Please verify your email address to log in.");
      return res.redirect("/");
    }
    return res.redirect("/dashboard");

  } catch (error) {
    console.log(error);
    req.flash("error_msg", "There was an error. Please try again later.");
    res.redirect('/');
  }
};

const logoutUser = async (req, res) => {
  req.logout();
  req.flash("success_msg", "You have been logged out.");
  return res.redirect("/");
};

const forgotPasswordPage = (req, res) => {
  res.render("forgot_pass", {title: "Forgot Password"});
};

const forgotPassword = async (req, res) => {
  try {
    const {email} = req.body;
    if (!email) {
      req.flash("error_msg", "Please provide a valid email.");
      return res.redirect("/forgot-password");
    }
    
    // Look up the user if one exists
    const user = await User.findOne({email});
    if (!user) {
      req.flash("error_msg", "Could not find a user with that email address.");
      return res.redirect("/forgot-password");
    }
    
    // Prevent user from requesting new reset link early
    if (user.passwordTokenExpirationDate && (user.passwordTokenExpirationDate < currentDate)) {
      req.flash("error_msg", "Please wait at least 10 minutes before requesting another reset link.");
      return res.redirect("/forgot-password");
    }
    const passwordToken = crypto.randomBytes(70).toString('hex');
    
    // Send password reset email
    const origin = process.env.BASE_URL;
    await sendResetPasswordEmail({
      name: user.first_name || "there",
      email: user.email,
      token: passwordToken,
      origin,
    });
    
    // User has 10 minutes to reset the password
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
    
    req.flash("success_msg", "Please check your email for the password reset link.");
    return res.redirect("/");

  } catch (error) {
    console.log(error);
    req.flash("error_msg", "There was an error. Please try again later.");
    res.redirect('/');
  }
};
  
const resetPasswordPage = (req, res) => {
  const {token, email} = req.query;
  res.render('reset_pass', {title: "Reset Password", token, email})
}

const resetPassword = async (req, res) => {
  try{
    const {token, email, password, confirm_pw} = req.body;

    // Ensure that the user's token, email, and passwords were provided
    if (!token || !email || !password || !confirm_pw) {
      req.flash("error_msg", "Please provide all values.");
      return res.redirect(`/reset-password?token=${token}&email=${email}`);
    }

    // Check if new password === retyped password
    if (password !== confirm_pw) {
      req.flash("error_msg", "Passwords do not match.");
      return res.redirect(`/reset-password?token=${token}&email=${email}`);
    }

    const user = await User.findOne({email});
    if (!user) {
      req.flash("error_msg", "Could not find a user with that email address.");
      return res.redirect("/");
    }

    // Check if stored password token is the same as the provided token and if the token is expired
    const currentDate = new Date();
    if (user.passwordToken !== createHash(token) || user.passwordTokenExpirationDate < currentDate) {
      req.flash("error_msg", "Password could not be reset. Please request a new reset link.");
      return res.redirect("/forgot-password");
    }

    // Update the user's password and clean up password token fields
    user.password = password;
    user.passwordToken = null;
    user.passwordTokenExpirationDate = null;
    await user.save();

    req.flash("success_msg", "Your password has been updated!");
    return res.redirect("/");
  
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "There was an error. Please try again later.");
    res.redirect('/');
  }
};

const ensureAuthenticated = (req, res, next) => {
  // Protect routes that require log in
  if (req.isAuthenticated()){ 
    res.locals.loggedId = true;
    return next();
  }
  req.flash('error_msg', 'You must be logged in to view this page.');
  res.redirect('/');
};

const forwardAuthenticated = (req, res, next) => {
  // Forward logged-in user to the dashboard
  if (!req.isAuthenticated()) return next();
  res.redirect('/dashboard');      
};

const rememberMeMiddleware = (req, res, next) => {
  if (req.body.remember_me) {
    // Set max age of cookie to 1 week (default 1 day) if remember me was checked
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    req.session.cookie.originalMaxAge = oneWeek;
  }
  next();
};

// User's dashboard
const showDashboard = (req, res) => {
  res.render("dashboard", {title: "Dashboard"});
};

module.exports = {
  showHomepage,
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  forgotPasswordPage,
  resetPassword,
  resetPasswordPage,
  ensureAuthenticated,
  forwardAuthenticated,
  rememberMeMiddleware,
  showDashboard
};
