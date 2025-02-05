const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const pg = require('pg');
const pgSession = require('connect-pg-simple')(session);
require('dotenv').config();

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

// Initialisation d'Express
const app = express();
app.use(express.json());

// Configuration de la session
app.use(session({
    store: new pgSession({ pool }),
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true, maxAge: 1000 * 60 * 60 } // 1h
}));

// Middleware pour gérer les fichiers statiques (servir index.htm)
app.use(express.static(path.join(__dirname, 'public/src')));

const authRoutes = require('./controller/Authentification');
app.use(authRoutes);

// Chemin vers les certificats SSL
const sslOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

// Création du serveur HTTPS
https.createServer(sslOptions, app).listen(3205, () => {
    console.log(`Serveur HTTPS lancé sur le port 3205`);
});
