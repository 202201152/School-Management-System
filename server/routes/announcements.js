const express = require('express');
const Announcement = require('../models/Announcement');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Get all announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create announcement
router.post('/', async (req, res) => {
    try {
        const { title, content, targetClass } = req.body;
        const newAnnouncement = new Announcement({ title, content, targetClass });
        const savedAnnouncement = await newAnnouncement.save();
        res.status(201).json(savedAnnouncement);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete announcement
router.delete('/:id', async (req, res) => {
    try {
        const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
        if (!deletedAnnouncement) return res.status(404).json({ message: 'Announcement not found' });
        res.json({ message: 'Announcement deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
