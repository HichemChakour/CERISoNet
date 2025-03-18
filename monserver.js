const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('./middlewares/cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./controller/Authentification');
const messageRoutes = require('./controller/Messages');
require('dotenv').config();

// Initialisation d'Express
const app = express();
app.use(express.json());

// Configuration de la session
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'MySession3205',
    touchAfter: 24 * 3600
});

store.on('error', function(error) {
    console.error('Session store error:', error);
});

app.use(session({
    secret: 'hichm',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        secure: false, 
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 3600 * 1000
    }
}));

// Middleware pour gérer les fichiers statiques
app.use(express.static(path.join(__dirname, '/CERISoNetApp/dist/ceriso-net-app/browser')));

// Configuration CORS
app.use(cors);

// Routes
app.use(authRoutes);
app.use(messageRoutes);

// Catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/CERISoNetApp/dist/ceriso-net-app/browser/index.html'));
});

// Connect to DB
connectDB();

// Configuration SSL
const sslOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

// Création du serveur HTTPS
https.createServer(sslOptions, app).listen(3205, () => {
    console.log(`Serveur HTTPS lancé sur le port 3205`);
});
