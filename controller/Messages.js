const express = require('express');
const router = express.Router();
const { getMessages, toggleLike, addComment, createMessage} = require('../services/messageService');

// Route pour récupérer les messages
router.get('/messages', getMessages);

// Route pour liker ou unliker un message
router.post('/messages/like', toggleLike);

// Route pour ajouter un commentaire
router.post('/messages/comment', addComment);

// Route pour créer un message
router.post('/messages/create', createMessage);

module.exports = router;