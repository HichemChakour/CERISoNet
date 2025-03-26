const mongoose = require('mongoose');
const Message = require('../models/messageModel');
const { db } = require('../config/db'); // PostgreSQL pour les utilisateurs

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find(); // Récupère tous les messages

        // Enrichir les messages avec les informations des utilisateurs et des commentaires
        const enrichedMessages = await Promise.all(
            messages.map(async (message) => {
                const createdByUser = await db.oneOrNone(
                    'SELECT id, pseudo, avatar, statut_connexion FROM fredouil.compte WHERE id = $1',
                    [message.createdBy]
                );

                const likedByUsers = await db.manyOrNone(
                    'SELECT id, pseudo, avatar FROM fredouil.compte WHERE id = ANY($1)',
                    [message.likedBy]
                );

                const enrichedComments = await Promise.all(
                    message.comments.map(async (comment) => {
                        const commentedByUser = await db.oneOrNone(
                            'SELECT id, pseudo, avatar, statut_connexion FROM fredouil.compte WHERE id = $1',
                            [comment.commentedBy]
                        );

                        // Nettoyer les données du commentaire
                        return {
                            _id: comment._id,
                            text: comment.text,
                            date: comment.date,
                            hour: comment.hour,
                            commentedByUser
                        };
                    })
                );

                return {
                    _id: message._id,
                    date: message.date,
                    hour: message.hour,
                    createdByUser,
                    body: message.body,
                    likes: message.likes,
                    likedByUsers,
                    hashtags: message.hashtags,
                    comments: enrichedComments,
                    images: message.images
                };
            })
        );

        res.status(200).json(enrichedMessages);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des messages : ' + error.message });
    }
};

const toggleLike = async (req, res) => {
    const { messageId, userId } = req.body;

    try {
        // Récupérer le message
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }

        // Vérifier si l'utilisateur a déjà liké
        const hasLiked = message.likedBy.includes(userId);

        if (hasLiked) {
            // Si déjà liké, retirer le like
            message.likedBy = message.likedBy.filter((id) => id !== userId);
            message.likes--;
        } else {
            // Sinon, ajouter le like
            message.likedBy.push(userId);
            message.likes++;
        }

        await db.manyOrNone(
            'SELECT id, pseudo, avatar FROM fredouil.compte WHERE id = ANY($1)',
            [message.likedBy]
        );

        // Sauvegarder les modifications
        await message.save();

        res.status(200).json({ message: 'Action effectuée avec succès'});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du like : ' + error.message });
    }
};

const addComment = async (req, res) => {
    const { messageId, text, commentedBy } = req.body;
    console.log(req.body);

    try {
        // Récupérer le message
        const message = await Message.findById(messageId);
        console.log(messageId);

        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }

        // Ajouter le commentaire
        const newComment = {
            _id: new mongoose.Types.ObjectId().toString(),
            text,
            commentedBy,
            date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
            hour: new Date().toISOString().split('T')[1].slice(0, 5) // Format: HH:mm
        };

        message.comments.push(newComment);

        // Sauvegarder le message
        await message.save();

        res.status(200).json({ message: 'Commentaire ajouté avec succès', comment: newComment });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire : ' + error.message });
    }
};

const createMessage = async (req, res) => {
    const { userId, body, imageUrl, imageTitle, hashtags } = req.body;

    try {
        const newMessage = new Message({
            _id: new mongoose.Types.ObjectId().toString(),
            date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
            hour: new Date().toISOString().split('T')[1].slice(0, 5), // Format: HH:mm
            createdBy: userId,
            body,
            images: { url: imageUrl, title: imageTitle },
            likes: 0,
            likedBy: [],
            hashtags: hashtags || [],
            comments: []
        });

        await newMessage.save();

        res.status(201).json({ message: 'Message créé avec succès', newMessage });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du message : ' + error.message });
    }
};

module.exports = {
    getMessages,
    toggleLike,
    addComment,
    createMessage
};
