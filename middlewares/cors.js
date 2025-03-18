const cors = require('cors');

// Configuration de CORS pour autoriser les requêtes depuis le front-end
const corsOptions = {
    origin: 'http://pedago.univ-avignon.fr:3206',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);
