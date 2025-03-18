const mongoose = require('mongoose');
const pgp = require('pg-promise')();
require('dotenv').config();

//connexion à la base de données mongoDB
const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error(err));
};

//connexion à la base de données postgres
const db = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT 
});

module.exports = { connectDB, db };
