const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Initialisation d'Express
const app = express();

// Port d'écoute
const PORT = 3205;

// Chemin vers les certificats SSL
const sslOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

// Middleware pour gérer les fichiers statiques (servir index.htm)
app.use(express.static(path.join(__dirname, 'public_html')));

// Route pour afficher les données de connexion
app.get('/login', (req, res) => {
    const { email, password } = req.query; // Récupère les paramètres du formulaire
    console.log(`Email: ${email}, Password: ${password}`);
    res.send('Les informations de connexion ont été reçues !');
});

// Création du serveur HTTPS
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Serveur HTTPS lancé sur le port ${PORT}`);
});
