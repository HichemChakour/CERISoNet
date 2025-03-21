const { db } = require('../config/db');
const Session = require('../models/sessionModel');
const { hashPassword } = require('../utils/crypto');

// Route de connexion
const login = async (req, res) => {
    const { email, password } = req.body;
    // Vérifier si l'email et le mot de passe sont renseignés
    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    try {
        // Vérifier si l'utilisateur existe
        const utilisateur = await db.oneOrNone('SELECT * FROM fredouil.compte WHERE mail = $1', [email]);
        if (!utilisateur) {
            return res.status(401).json({ message: "Utilisateur introuvable" });
        }

        // Vérifier si le mot de passe est correct
        const hashedPassword = hashPassword(password);
        if (hashedPassword !== utilisateur.motpasse) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }
        const session = await Session.findOne({ "session.email": utilisateur.mail });
        const lastConnexion =  "Dernière connexion :" + session?.session.lastConnexion.toLocaleString('fr-FR', { timeZone: 'UTC' }) ?? "Première connexion";
        req.session.lastConnexion = new Date();
        req.session.isConnected = true;
        req.session.username = utilisateur.pseudo;
        req.session.email = utilisateur.mail;

         // Mettre à jour le statut de connexion dans PostgreSQL
         await db.none('UPDATE fredouil.compte SET statut_connexion = 1 WHERE mail = $1', [email]);

        res.json({ message: "Connexion réussie", userId:utilisateur.id, pseudo: req.session.username, session: req.session.id, lastConnexion: lastConnexion, avatar: utilisateur.avatar });
    } catch (err) {
        console.error(err);
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
        return res.status(401).json({ message: "Utilisateur non connecté" });
    }

    try {
        // Récupérer l'ID de la session depuis le corps de la requête
        const sessionId = req.body.session;
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(401).json({ message: "Session introuvable" });
        }

        // Mettre à jour le statut de connexion dans PostgreSQL
        await db.none('UPDATE fredouil.compte SET statut_connexion = 0 WHERE mail = $1', [session.session.email]);

        // Mettre à jour la session dans MongoDB
        session.set("session.isConnected", false);
        await session.save();


        return res.json({ message: "Déconnexion réussie" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur serveur lors de la déconnexion" });
    }
};


module.exports = { login, getSession, logout };
