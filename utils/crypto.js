const crypto = require('crypto');

// Fonction de hashage du mot de passe
const hashPassword = (password) => {
    return crypto.createHash('sha1').update(password).digest('hex');
};

module.exports = { hashPassword };
