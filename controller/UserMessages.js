const express = require('express');
const router = express.Router();
const {getUserMessages } = require('../services/userMessageService');


// Route pour récupérer les messages de l'utilisateur
router.get('/user/messages/:userId', getUserMessages);

module.exports = router;