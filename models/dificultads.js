var mongoose = require('mongoose');

var dificultadSchema = mongoose.Schema({
    nombre: String
});

module.exports = mongoose.model('Dificultad', dificultadSchema);