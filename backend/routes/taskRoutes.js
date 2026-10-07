const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all tasks
router.get("/", authMiddleware, async (req, res) => {

    const tasks = await Task.find({
        userId: req.userId
    }).sort({ createdAt: -1 });

    res.json(tasks);
});

// Add task
router.post("/", authMiddleware, async (req, res) => {

    const { title, category, dueDate } = req.body;

    const task = new Task({
        userId: req.userId,
        title,
        category,
        dueDate
    });

    await task.save();

    res.status(201).json(task);
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {

    const task = await Task.findOneAndUpdate(
        {
            _id: req.params.id,
            userId: req.userId
        },
        req.body,
        { new: true }
    );

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json(task);
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {

    const task = await Task.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId
    });

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json({
        message: "Task deleted"
    });
});

module.exports = router;