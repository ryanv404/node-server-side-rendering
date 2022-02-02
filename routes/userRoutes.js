const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../controllers/authController');
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
} = require('../controllers/userController');

router.route('/').get(ensureAuthenticated, getAllUsers);
router.route('/me').get(ensureAuthenticated, showCurrentUser);
router.route('/:id').get(ensureAuthenticated, getSingleUser);
router.route('/updateUser').patch(ensureAuthenticated, updateUser);
router.route('/updateUserPassword').patch(ensureAuthenticated, updateUserPassword);

module.exports = router;
