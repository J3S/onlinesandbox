var mongoose = require('mongoose');

var ejercicioSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    datosEntrada: [{}],
    datosSalida: String,
    etiquetas: [{}],
    dificultad: {},
    autor: {}
});

module.exports = mongoose.model('Ejercicio', ejercicioSchema);