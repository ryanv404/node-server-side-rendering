const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../controllers/authController');
const {getBooksHome} = require('../controllers/bookController');

router.route('/').get(ensureAuthenticated, getBooksHome);

module.exports = router;
