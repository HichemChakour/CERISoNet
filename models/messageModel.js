const mongoose = require('mongoose');

// Création du schéma de message
const messageSchema = new mongoose.Schema({
    _id: Number,
    date: String,
    hour: String,
    createdBy: Number,
    body: String,
    likes: Number,
    likedBy: [Number],
    hashtags: [String],
    comments: [
        {
            _id: String,
            text: String,
            commentedBy: Number,
            date: String,
            hour: String
        }
    ],
    images: {
        url: String,
        title: String
    }
}, { collection: 'CERISoNet' });

module.exports = mongoose.model('CERISoNet', messageSchema);
