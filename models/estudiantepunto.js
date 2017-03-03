var mongoose = require('mongoose');

var estudiantepuntoSchema = new mongoose.Schema({
    idEstudiante: String,
    puntos: Number
});

module.exports = mongoose.model('EstudiantePuntos', estudiantepuntoSchema);