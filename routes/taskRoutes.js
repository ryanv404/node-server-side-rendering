const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../controllers/authController");
const {
  getAllTasks, 
  createTask, 
  updateTaskStatus, 
  updateTask, 
  deleteTask} = require('../controllers/tasksController');

router.get('/', ensureAuthenticated, getAllTasks);
router.post('/', ensureAuthenticated, createTask);
router.put('/update/:taskID', ensureAuthenticated, updateTask);
router.patch('/update/:taskID', ensureAuthenticated, updateTaskStatus);
router.delete('/delete/:taskID', ensureAuthenticated, deleteTask);

module.exports = router;
