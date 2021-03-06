const Task = require("../models/Task");

// Get the user's tasks
const getAllTasks = async (req, res) => {
  let tasks = [];
  try {
    tasks = await Task.find({taskOwner: req.user._id});
  } catch (err) {
    console.log(err);
    tasks = [];
  }
  res.render("tasks", {title: "Tasks", tasks});
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const newTask = new Task({
      taskName: req.body.task,
      taskOwner: req.user._id
    });
    await newTask.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect("/tasks");
};

// Update a task
const updateTask = async (req, res) => {
  let updateObj = {};
  try {
    const task = await Task.findById(req.params.taskID);
    if (req.body.task_status !== task.taskStatus) {
      updateObj.taskStatus = req.body.task_status;
    }
    if (req.body.modified_task !== task.taskName) {
      updateObj.taskName = req.body.modified_task;
    }
    if (updateObj) {
      await Task.findByIdAndUpdate(req.params.taskID, {$set: updateObj});
    }
    } catch (err) {
    console.log(err);
  }
  res.redirect("/tasks");
};

// Update a task status
const updateTaskStatus = async (req, res) => {
  try {
    const completed = await Task.findByIdAndUpdate(req.params.taskID, 
      {$set: {taskStatus: req.query.status}}
    );
    if (completed) {
      req.flash("success_msg", "Task status successfully updated.");
    } else {
      req.flash("error_msg", "Task update failed.");
    }
  } catch (err) {
  console.log(err);
  }
  res.redirect("/tasks");
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskID);
  } catch (err) {
    console.log(err);
  }
  res.redirect("/tasks");
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};
