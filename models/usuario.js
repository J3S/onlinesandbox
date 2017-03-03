var mongoose=require('mongoose');

var UsuarioSchema=new mongoose.Schema({
  nombres:String,
  apellidos:String,
  correo:String,
  rol:String ,
  tipoid:String,
  identificacion:String,
  carrera:String,
  password:String
}, { versionKey: false, collection: 'usuario'});

UsuarioSchema.statics.getUsuarioNombre = function(nombre, apellido, cb) {
  return this.find({ 'nombres': {$in: nombre}, 'apellidos': {$in: apellido} }, cb);
};

var usuario = module.exports = mongoose.model("usuario",UsuarioSchema);

module.exports.getUsuarios = function(callback, limit){
  usuario.find(callback).limit(limit);
}

module.exports.removeUser = (id, callback) => {
	var query = {_id: id};
	usuario.remove(query, callback);
}