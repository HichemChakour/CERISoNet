const Message = require('../models/messageModel');
const { db } = require('../config/db');

const getUserMessages = async (req, res) => {
    const { userId } = req.params;

    try {
        // Récupérer tous les messages créés par l'utilisateur
        const messages = await Message.find({ createdBy: userId });
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

        // Send the enriched messages as the response
        res.status(200).json(enrichedMessages);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des messages : ' + error.message });
    }
};

module.exports = {
    getUserMessages
};