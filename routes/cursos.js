var express = require('express');
var router = express.Router();
var Cursos = require('../models/cursos');
var Usuarios = require('../models/usuario');
var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs   = require('fs');
var path = require('path');

var csv = require('fast-csv');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.user){
    if(req.user.rol === 'Administrador'){
  Cursos.getCursos(function(e, curs){
  		//console.log(users);
		res.render('cursos/index', {cursos: curs, user: req.user});
	});
      } else {
      return res.render('nopermitido');
    }
  } else {
    return res.redirect('/index');
  }
});

//pagina de crear curso
router.get('/crear', function(req, res, next) {
    if(req.user){
    if(req.user.rol === 'Administrador'){
	res.render('cursos/crear', {user: req.user});	
      } else {
      return res.render('nopermitido');
    }
  } else {
    return res.redirect('/index');
  }
});

//obtener los usuarios para input autocompletar
router.get('/crear/obtener', function(req, res, next) {
	Usuarios.getUsuarios(function(e, users){
  		//console.log(users);
		res.json(users);
	});	
});

//guardar curso en la base de datos
router.post('/crear', function(req, res, next) {
    if(req.user){
    if(req.user.rol === 'Administrador'){
  var profesor = req.param('profesor');
  var paralelo = req.param('paralelo');
  var estudiantes = req.param('est');
  console.log(estudiantes);
  	var curso = new Cursos ({
      profesor: profesor,
      paralelo: paralelo,
      estudiantes: estudiantes
    });

    // Saving it to the database.
    curso.save(function (err) {if (err) console.log ('Error on save!')});
    console.log("guardado con exito");
        } else {
      return res.render('nopermitido');
    }
  } else {
    return res.redirect('/index');
  }
});

//pagina de lista de estudiantes 
router.get('/lista/:_id', function(req, res, next){
    if(req.user){
    if(req.user.rol === 'Administrador'){
  Cursos.findById(req.params._id, function(err, curs) {
    if (err){
      throw err;
    }else{
      console.log(curs);
      res.render('cursos/lista', {cursos: curs, user: req.user});
    }        
  });    
      } else {
      return res.render('nopermitido');
    }
  } else {
    return res.redirect('/index');
  }
});

//obtener lista de estudiantes 
router.get('/lista/obtener/:_id', function(req, res, next){
  Cursos.findById(req.params._id, function(err, curs) {
    if (err){
      throw err;
    }else{
      console.log(curs);
      res.render('cursos/lista', {cursos: curs});
    }        
  });    
});

//eliminar cursoo
router.get('/:_id', function(req, res, next){
    if(req.user){
    if(req.user.rol === 'Administrador'){
  var id = req.params._id;
  Cursos.removeCurso(id, (err, curso) => {
    if(err){
      throw err;
    } else {
      res.redirect('/cursos/');
    }
  });
      } else {
      return res.render('nopermitido');
    }
  } else {
    return res.redirect('/index');
  }
});

//editar curso
router.get('/editar/:_id', function(req, res, next){
    if(req.user){
    if(req.user.rol === 'Administrador'){
  Cursos.findById(req.params._id, function(err, curso) {
    if (err){
      throw err;
    }else{
      console.log(curso);
      res.render('cursos/editar', {cursos: curso, user: req.user});
    }        
  });    
      } else {
      return res.render('nopermitido');
    }
  } else {
    return res.redirect('/index');
  }
});

router.post('/editar/:_id', function(req, res, next) {
    if(req.user){
    if(req.user.rol === 'Administrador'){
  Cursos.findById(req.params._id, function(err, curso) {
    if (err){
      throw err;
    }else{
      curso.profesor = req.param('profesor');
      curso.paralelo = req.param('paralelo');
      curso.estudiantes = req.param('est');

      curso.save(function (err) {if (err) console.log ('Error on save!')});
      console.log("actualizado con exito");
    }        
  });  
      } else {
      return res.render('nopermitido');
    }
  } else {
    return res.redirect('/index');
  }
});

//leer csv y guardar datos
router.post('/archivo', function(req, res, next) {
	
	var multiparty = require("multiparty");
	var form = new multiparty.Form();

	form.parse(req, function(err, fields, files){
		//res.send("name: "+fields.name);
		var fil = files.file[0];
		//console.log(files);
		fs.readFile(fil.path, function(err, data){
			var path = "./public/uploads/" + fil.originalFilename;
			//res.send(path);
			fs.writeFile(path, data, function(err){
				if(err) console.log(err);
				var dataArr = [];
				var array = "";
				fs.createReadStream(path).pipe(csv()).on('data', function(data){
					//console.log(data);
					var listaCurso = data[0].split(';');
					//console.log(listaCurso);
					dataArr.push(data[0]);
					
					
				}).on('end', function(data){
		
					for(var i=0; i < data; i++){
						var fila = dataArr[i];
						var arreglo = fila.split(';');
						for(var j=2; j < arreglo.length; j++){
							if(j==(arreglo.length-1)){
								array = array + String(arreglo[j]);
							}else{
								array = array + String(arreglo[j]) + " , ";
							}
							
						}
						var curso = new Cursos ({
			      			profesor: arreglo[0],
			      			paralelo: arreglo[1],
			      			estudiantes: array
			    		});

			
			    		curso.save(function (err) {if (err) console.log ('Error on save!')});
			    		console.log("guardado con exito");
						array = "";
					}

					res.redirect('/cursos/');
					
	
				});

			});
		});
	});
});

module.exports = router;