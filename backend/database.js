// database.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('data.db', (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données :', err.message);
    } else {
        console.log('Connexion à la base de données réussie.');
        db.run(`CREATE TABLE IF NOT EXISTS timers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            machineId TEXT,
            résidenceId TEXT,
            état TEXT,
            dateDébut TEXT,
            typeDurée TEXT
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table timers :', err.message);
            } else {
                console.log('Table timers créée avec succès.');
                db.get("SELECT COUNT(*) AS count FROM timers", (err, row) => {
                    if (err) {
                        console.error('Erreur lors de la vérification des données par défaut :', err.message);
                    } else {
                        if (row.count === 0) {
                            remplirBaseDeDonnees();
                        } else {
                            console.log('Les données par défaut sont déjà présentes dans la table timers.');
                        }
                    }
                });
            }
        });
    }
});

function insererTimer(machineId, résidenceId, état, dateDébut, typeDurée) {
    db.run(`INSERT INTO timers (machineId, résidenceId, état, dateDébut, typeDurée) 
            VALUES (?, ?, ?, ?, ?)`, [machineId, résidenceId, état, dateDébut, typeDurée], function(err) {
        if (err) {
            console.error('Erreur lors de l\'insertion dans la table timers :', err.message);
        } else {
            console.log('Nouvelle ligne insérée avec succès dans la table timers.');
        }
    });
}


function remplirBaseDeDonnees() {
    const résidences = ['robes', 'felling', 'wallon', 'madrillets', 'catheliers'];
    const machines = [1, 2, 3, 4];

    résidences.forEach(residence => {
        machines.forEach(machine => {
            // Modification ici pour définir "30" par défaut et éviter les valeurs null
            insererTimer(`bouton_machine${machine}_${residence}`, residence, 'Libre', null, "30");
        });
    });
}

function updateTimer(machineId, résidenceId, état, dateDébut, typeDurée, callback) {
    if (!machineId || !résidenceId || !état || !dateDébut || !typeDurée) {
        const errorMsg = 'Données invalides pour la mise à jour du timer';
        console.error(errorMsg);
        return callback(new Error(errorMsg));
    }

    // Vérification et correction de la valeur null dans le typeDurée
    const correctedTypeDurée = typeDurée || "30";

    db.run(`UPDATE timers SET état = ?, résidenceId = ?, dateDébut = ?, typeDurée = ? WHERE machineId = ?`, 
            [état, résidenceId, dateDébut, correctedTypeDurée, machineId], function(err) {
        if (err) {
            console.error('Erreur lors de la mise à jour de l\'état et de la durée du timer :', err.message);
            return callback(err);
        }
        console.log('État et durée du timer mis à jour avec succès.');
        // Passer l'objet timer mis à jour au callback de succès
        afficherTimer(machineId, callback);
    });
}

function cancelTimer(machineId, résidenceId, état, dateDébut, typeDurée, callback) {
    if (!machineId || !résidenceId || !état) { 
        const errorMsg = 'Données invalides pour l\'annulation du timer';
        console.error(errorMsg);
        return callback(new Error(errorMsg));
    }

    console.log(`Annulation du timer pour machineId: ${machineId}, résidenceId: ${résidenceId}, état: ${état}`);
    // Correction de la valeur null dans le typeDurée
    const correctedTypeDurée = typeDurée || "30";

    db.run(`UPDATE timers SET état = ?, dateDébut = ?, typeDurée = ? WHERE machineId = ? AND résidenceId = ?`, 
            [état, dateDébut, correctedTypeDurée, machineId, résidenceId], function(err) {
        if (err) {
            console.error('Erreur lors de l\'annulation du timer :', err.message, {
                sql: this.sql,
                params: [état, dateDébut, correctedTypeDurée, machineId, résidenceId]
            });
            return callback(err);
        }
        console.log('État du timer annulé avec succès.');
        afficherTimer(machineId, callback);
    });
}



function afficherTimer(machineId, callback) {
    console.log(`Affichage du timer pour machineId: ${machineId}`);
    db.get("SELECT * FROM timers WHERE machineId = ?", [machineId], (err, row) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'enregistrement de la table timers :', err.message);
            return callback(err);
        }
        console.log('Contenu de la ligne modifiée de la table timers :', row);
        callback(null, row);
    });
}

function afficherTousLesTimers() {
    db.all("SELECT * FROM timers", [], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des enregistrements de la table timers :', err.message);
            return;
        }
        console.log('Contenu de la table timers :');
        rows.forEach(row => {
            console.log(row);
        });
    });
}
function getAllTimers(callback) {
    db.all("SELECT * FROM timers", [], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des enregistrements de la table timers :', err.message);
            return callback(err);
        }
        callback(null, rows);
    });
}

module.exports = {
    afficherTousLesTimers,
    updateTimer,
    cancelTimer,
    afficherTimer,
    getAllTimers // Ajoutez cette ligne
};
