// Exemple de modification dans buttons.js
async function updateButtonState(buttonId) {
    try {
        const response = await fetch(`/api/boutons/${buttonId}/click`, { method: 'POST' });
        const data = await response.json();
        console.log(data.message); // Affiche un message de confirmation dans la console
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'état du bouton:', error);
    }
}
