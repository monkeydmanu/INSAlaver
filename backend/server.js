const express = require('express');
const bodyParser = require('body-parser');
const app = require('./app'); 
const db = require('./database');
const path = require('path');

const server = express();

server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

server.use(bodyParser.json());
server.use('/', app);
server.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
    db.afficherTousLesTimers();
});
