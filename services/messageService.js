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
                            'SELECT id, pseudo, avatar ,statut_connexion FROM fredouil.compte WHERE id = $1',
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

        res.status(200).json(enrichedMessages);
    } catch (error) {
        throw new Error('Erreur lors de la récupération des messages : ' + error.message);
    }
}

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

        const likedByUsers = await db.manyOrNone(
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

module.exports = {
    getMessages,
    toggleLike
};
