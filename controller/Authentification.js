const express = require('express');
const router = express.Router();
const { login, getSession, logout } = require('../services/authService');

// Routes d'authentification
router.post('/login', login);
router.get('/session', getSession);
router.post('/logout', logout);

module.exports = router;
