// Boutons.js
const mongoose = require('mongoose');

const BoutonsSchema = mongoose.Schema({
  classe: { type: String, required: true }, // Changer le nom du champ en "classe"
});

module.exports = mongoose.model('Boutons', BoutonsSchema);
