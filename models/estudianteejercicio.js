var mongoose = require('mongoose');

var estudianteejercicioSchema = new mongoose.Schema({
    idEstudiante: String,
    idEjercicios: []
});

estudianteejercicioSchema.statics.getEstudianteEjercicio = function(idest, cb) {
  return this.find({ 'idEstudiante': idest }, cb);
};

module.exports = mongoose.model('EstudianteEjercicio', estudianteejercicioSchema);