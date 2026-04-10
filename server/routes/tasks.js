const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status || ''; // 'pending' or 'completed'

        const query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (status && status !== 'all') {
            query.status = status;
        }

        const total = await Task.countDocuments(query);
        const tasks = await Task.find(query)
            .populate('assignedTo', 'name class rollNumber')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            tasks,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add task
router.post('/', async (req, res) => {
    try {
        const { title, description, assignedTo, dueDate } = req.body;
        const newTask = new Task({ title, description, assignedTo, dueDate });
        const savedTask = await newTask.save();
        const populatedTask = await savedTask.populate('assignedTo', 'name class rollNumber');
        res.status(201).json(populatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Edit task (e.g. mark complete)
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedTo', 'name class rollNumber');
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
