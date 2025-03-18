const express = require('express');
const router = express.Router();
const messageService = require('../services/messageService');

router.get('/messages', async (req, res) => {
    try {
        const messages = await messageService.getMessagesWithUsersAndComments();
        res.status(200).json(messages); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;