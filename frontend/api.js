// Définition des fonctions pour envoyer des requêtes au backend

// Fonction pour envoyer une requête POST pour insérer un timer dans la base de données
async function insererTimer(machineId, résidenceId, état, dateDébut, typeDurée) {
    try {
        const response = await fetch('/inserer-timer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ machineId, résidenceId, état, dateDébut, typeDurée })
        });
        if (!response.ok) {
            throw new Error('Erreur lors de l\'insertion du timer');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

// Exporter les fonctions pour une utilisation dans d'autres fichiers
export { insererTimer };