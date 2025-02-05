const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = pgp({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
    }
    try {
        const utilisateur = await db.oneOrNone('SELECT * FROM fredouil.compte WHERE mail = $1', [email]);

        if (!utilisateur) {
            return res.status(401).json({ message: "Utilisateur non trouvé" });
        }

        if (password !== utilisateur.motpasse) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Mettre à jour le statut de connexion (1 = connecté)
        await db.none('UPDATE fredouil.compte SET statut_connexion = 1 WHERE mail = $1', [email]);

        // Mettre à jour la dernière connexion
        //await db.none('UPDATE fredouil.compte SET last_login = NOW() WHERE email = $1', [email]);

        // Stocker l’utilisateur dans la session
        req.session.user = {
            id: utilisateur.id,
            mail: utilisateur.mail,
            pseudo: utilisateur.pseudo,
            avatar: utilisateur.avatar
        };

        res.json({ message: "Connexion réussie", pseudo: utilisateur.pseudo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get('/user', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Non connecté" });
    }
    res.json(req.session.user);
});

router.post('/logout', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Non connecté" });
    }

    // Mettre à jour le statut de connexion (0 = déconnecté)
    await db.none('UPDATE fredouil.compte SET statut_connexion = 0 WHERE mail = $1', [req.session.user.mail]);

    req.session.destroy(() => {
        res.json({ message: "Déconnexion réussie" });
    });
});

module.exports = router;