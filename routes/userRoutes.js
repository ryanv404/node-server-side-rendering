const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../controllers/authController');
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  getUsersHome
} = require('../controllers/userController');

router.route('/').get(ensureAuthenticated, getAllUsers);
router.route('/home').get(ensureAuthenticated, getUsersHome);
router.route('/me').get(ensureAuthenticated, showCurrentUser);
router.route('/:id').get(ensureAuthenticated, getSingleUser);
router.route('/updateUser').patch(ensureAuthenticated, updateUser);

module.exports = router;
