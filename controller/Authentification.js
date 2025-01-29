const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    const { email, password } = req.query; // Récupère les paramètres du formulaire
    console.log(`Email: ${email}, Password: ${password}`);
    res.send('caca');
});

module.exports = router;