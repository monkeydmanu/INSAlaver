const express = require('express');
const db = require('./database');

const app = express();
app.use(express.json());

app.post('/timers/update', (req, res) => {
    const { machineId, résidenceId, état, dateDébut, typeDurée } = req.body;
    console.log(`Requête de mise à jour reçue pour machineId: ${machineId}, résidenceId: ${résidenceId}, état: ${état}, dateDébut: ${dateDébut}, typeDurée: ${typeDurée}`);

    if (!machineId || !résidenceId || !état || !dateDébut || !typeDurée) {
        const errorMsg = 'Données invalides pour la mise à jour du timer';
        console.error(errorMsg);
        return res.status(400).json({ message: errorMsg });
    }

    db.updateTimer(machineId, résidenceId, état, dateDébut, typeDurée, (err, row) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de l\'état et de la durée du timer :', err.message);
            return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état et de la durée du timer', error: err.message });
        }
        console.log('État et durée du timer mis à jour avec succès dans la base de données.', row);
        res.status(200).json({ message: 'État et durée du timer mis à jour avec succès', timer: row });
    });
});

app.post('/timers/cancel', (req, res) => {
    const { machineId, résidenceId, état, dateDébut, typeDurée } = req.body;
    console.log(`Requête d'annulation reçue pour machineId: ${machineId}, résidenceId: ${résidenceId}, état: ${état}, dateDébut: ${dateDébut}, typeDurée: ${typeDurée}`);

    if (!machineId || !résidenceId || !état) {
        const errorMsg = 'Données invalides pour l\'annulation du timer';
        console.error(errorMsg);
        return res.status(400).json({ message: errorMsg });
    }

    // Correction de la valeur null dans le typeDurée
    const correctedTypeDurée = typeDurée || "30";

    db.cancelTimer(machineId, résidenceId, état, dateDébut, correctedTypeDurée, (err, row) => {
        if (err) {
            console.error('Erreur lors de l\'annulation du timer :', err.message);
            return res.status(500).json({ message: 'Erreur lors de l\'annulation du timer', error: err.message });
        }
        console.log('État du timer annulé avec succès dans la base de données.', row);
        res.status(200).json({ message: 'État du timer annulé avec succès', timer: row });
    });
});



app.get('/timers', (req, res) => {
    //console.log('Requête reçue pour récupérer tous les timers.');
    db.getAllTimers((err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des enregistrements de la table timers :', err.message);
            return res.status(500).json({ message: 'Erreur lors de la récupération des enregistrements de la table timers', error: err.message });
        }
        res.status(200).json(rows);
    });
});

module.exports = app;
