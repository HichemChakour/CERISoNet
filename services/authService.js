const { db } = require('../config/db');
const Session = require('../models/sessionModel');
const { hashPassword } = require('../utils/crypto');
const { broadcast } = require('../utils/websocket');

// Route de connexion
const login = async (req, res) => {
    const { email, password } = req.body;
    // Vérifier si l'email et le mot de passe sont renseignés
    if (!email || !password) {
        broadcast({ type: 'error', message: 'Email et mot de passe requis' });
        return res.status(400);
    }

    try {
        // Vérifier si l'utilisateur existe
        const utilisateur = await db.oneOrNone('SELECT * FROM fredouil.compte WHERE mail = $1', [email]);
        if (!utilisateur) {
            broadcast({ type: 'error', message: 'Utilisateur introuvable' });
            return res.status(401);
        }

        // Vérifier si le mot de passe est correct
        const hashedPassword = hashPassword(password);
        if (hashedPassword !== utilisateur.motpasse) {
            broadcast({ type: 'error', message: 'Mot de passe incorrect' });
            return res.status(401);
        }
        const session = await Session.findOne({ "session.email": utilisateur.mail });
        const lastConnexion =  "Dernière connexion :" + session?.session.lastConnexion.toLocaleString('fr-FR', { timeZone: 'UTC' }) ?? "Première connexion";
        req.session.lastConnexion = new Date();
        req.session.isConnected = true;
        req.session.username = utilisateur.pseudo;
        req.session.email = utilisateur.mail;

         // Mettre à jour le statut de connexion dans PostgreSQL
         await db.none('UPDATE fredouil.compte SET statut_connexion = 1 WHERE mail = $1', [email]);

        broadcast({ type: 'success', message: 'Un utilisateur s\'est connecté.' });
        res.json({ message: "Connexion réussie", userId:utilisateur.id, pseudo: req.session.username, session: req.session.id, lastConnexion: lastConnexion, avatar: utilisateur.avatar });
    } catch (err) {
        console.error(err);
        broadcast({ type: 'error', message: 'Erreur serveur' });
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Vérifier la session
const getSession = async (req, res) => {
    // Récupérer l'ID de session
    const sessionId = req.query.sessionId;
    if (!sessionId) {
        return res.status(400).json({ message: "Vous n'êtes pas connecté" });
    }

    try {
        // Vérifier si la session existe
        const session = await Session.findById(sessionId);
        if (session?.session.isConnected === false) {
            return res.status(401).json({ message: "Session introuvable" });
        }

        // Vérifier si la session a expiré
        if (new Date() > session.expires) {
            await db.none('UPDATE fredouil.compte SET statut_connexion = 0 WHERE mail = $1', [session.session.email]);
            return res.status(401).json({ message: "Session expirée" });
        }

        // Vérifier si l'utilisateur est connecté   
        if (!session.session.username) {
            return res.status(401).json({ message: "Non connecté" });
        }

        res.json({ username: session.session.username, isConnected: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Déconnexion
const logout = async (req, res) => {
    if (!req.body.session) {
        broadcast({ type: 'error', message: 'Utilisateur non connecté' });
        return res.status(401);
    }

    try {
        // Récupérer l'ID de la session depuis le corps de la requête
        const sessionId = req.body.session;
        const session = await Session.findById(sessionId);

        if (!session) {
            broadcast({ type: 'error', message: 'Session introuvable' });
            return res.status(401);
        }

        // Mettre à jour le statut de connexion dans PostgreSQL
        await db.none('UPDATE fredouil.compte SET statut_connexion = 0 WHERE mail = $1', [session.session.email]);

        // Mettre à jour la session dans MongoDB
        session.set("session.isConnected", false);
        await session.save();


        broadcast({ type: 'success', message: "Déconnexion réussie" });
        return res.status(200).json({ message: "Déconnexion réussie" });

    } catch (err) {
        console.error(err);
        broadcast({ type: 'error', message: 'Erreur serveur lors de la déconnexion' });
        return res.status(500);
    }
};


module.exports = { login, getSession, logout };
