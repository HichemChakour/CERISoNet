const Message = require('../models/messageModel');
const { db } = require('../config/db'); // PostgreSQL pour les utilisateurs

async function getMessagesWithUsersAndComments() {
    try {
        const messages = await Message.find(); // Récupère tous les messages

        // Enrichir les messages avec les informations des utilisateurs et des commentaires
        const enrichedMessages = await Promise.all(
            messages.map(async (message) => {
                const createdByUser = await db.oneOrNone(
                    'SELECT id, pseudo, mail, avatar FROM fredouil.compte WHERE id = $1',
                    [message.createdBy]
                );

                const likedByUsers = await db.manyOrNone(
                    'SELECT id, pseudo, mail, avatar FROM fredouil.compte WHERE id = ANY($1)',
                    [message.likedBy]
                );

                const enrichedComments = await Promise.all(
                    message.comments.map(async (comment) => {
                        const commentedByUser = await db.oneOrNone(
                            'SELECT id, pseudo, mail, avatar FROM fredouil.compte WHERE id = $1',
                            [comment.commentedBy]
                        );

                        return {
                            ...comment,
                            commentedByUser
                        };
                    })
                );

                return {
                    ...message.toObject(),
                    createdByUser,
                    likedByUsers,
                    comments: enrichedComments
                };
            })
        );

        return enrichedMessages;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des messages : ' + error.message);
    }
}

module.exports = {
    getMessagesWithUsersAndComments
};