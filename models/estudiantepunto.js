var mongoose = require('mongoose');

var estudiantepuntoSchema = new mongoose.Schema({
    idEstudiante: String,
    puntos: Number
});

estudiantepuntoSchema.statics.getEstudiantePunto = function(idest, cb) {
  return this.find({ 'idEstudiante': idest }, cb);
};

module.exports = mongoose.model('EstudiantePuntos', estudiantepuntoSchema);