var mongoose = require('mongoose');

var etiquetaSchema = mongoose.Schema({
    nombre: String
});

module.exports = mongoose.model('Etiqueta', etiquetaSchema);