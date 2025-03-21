const express = require('express');
const router = express.Router();
const { getMessages, toggleLike } = require('../services/messageService');

// Route pour récupérer les messages
router.get('/messages', getMessages);

// Route pour liker ou unliker un message
router.post('/messages/like', toggleLike);

module.exports = router;