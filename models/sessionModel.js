const mongoose = require('mongoose');

// Création du schéma de session
const sessionSchema = new mongoose.Schema({
    _id: String,
    expires: Date,
    session: Object
}, { collection: 'MySession3205' });

module.exports = mongoose.model('MySession3205', sessionSchema);
