var mongoose=require('mongoose');

var CursoSchema=new mongoose.Schema({
  profesor:String,
  paralelo:String,
  estudiantes:String
}, { versionKey: false, collection: 'cursos'});

var curso = module.exports = mongoose.model("cursos",CursoSchema);

module.exports.getCursos = function(callback, limit){
  curso.find(callback).limit(limit);
}

module.exports.removeCurso = (id, callback) => {
  var query = {_id: id};
  curso.remove(query, callback);
}

module.exports.deleteCurso = function(idUser, next) {
    var path = '/usuarios/' + idUser;
 
    var options = {
        host: host,
        port: port,
        path: path,
        method: 'DELETE',
        encoding: null
    };
 
    // Se invoca el servicio RESTful con las opciones configuradas previamente y sin objeto JSON.
    invocarServicio(options, null, function (user, err) {
        next(err);
    });
};