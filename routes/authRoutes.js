const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  showHomepage,
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  forgotPasswordPage,
  resetPassword,
  resetPasswordPage,
  showDashboard,
  ensureAuthenticated,
  forwardAuthenticated
} = require("../controllers/authController");

router.get('/', forwardAuthenticated, showHomepage)
router.get('/dashboard', ensureAuthenticated, showDashboard)
router.post('/register', registerUser);
router.post('/login', passport.authenticate('local', {failureRedirect: '/', failureFlash: true}), loginUser);
router.delete('/logout', ensureAuthenticated, logoutUser);
router.get('/verify-email', verifyEmail);
router.route('/reset-password').get(resetPasswordPage).post(resetPassword);
router.route('/forgot-password').get(forgotPasswordPage).post(forgotPassword);

module.exports = router;
