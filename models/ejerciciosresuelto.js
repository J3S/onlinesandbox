var mongoose = require('mongoose');

var ejerciciosresueltoSchema = new mongoose.Schema({
    fecha: String,
    numejercicio: Number
});

ejerciciosresueltoSchema.statics.getReporteEjercicios = function(fecha, cb) {
  return this.find({ 'fecha': {$in: fecha} }, cb);
};

var er = module.exports = mongoose.model('EjerciciosResueltos', ejerciciosresueltoSchema);

