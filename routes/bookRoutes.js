const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../controllers/authController');
const {getBooksHome, searchBooks} = require('../controllers/bookController');

router.get('/', ensureAuthenticated, getBooksHome);
router.get('/search', ensureAuthenticated, searchBooks);

module.exports = router;
