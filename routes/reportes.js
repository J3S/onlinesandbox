var express = require('express');
var router = express.Router();

var EjercicioResuelto = require('../models/ejerciciosresuelto');
var EstudianteEjercicio = require('../models/estudianteejercicio');
var EstudiantePuntos = require('../models/estudiantepunto');
var Cursos = require('../models/cursos');
var Usuario = require('../models/usuario');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user) {
    if (req.user.rol === 'Administrador')
        return res.render('reportes/index', {'user': req.user});
    else
        return res.render('nopermitido');
    } else
        return res.redirect('/login');
});

function dateConvert(dateobj,format){
  var year = dateobj.getFullYear();
  var month= ("0" + (dateobj.getMonth()+1)).slice(-2);
  var date = ("0" + dateobj.getDate()).slice(-2);
  var hours = ("0" + dateobj.getHours()).slice(-2);
  var minutes = ("0" + dateobj.getMinutes()).slice(-2);
  var seconds = ("0" + dateobj.getSeconds()).slice(-2);
  var day = dateobj.getDay();
  var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  var dates = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  var converted_date = "";

  switch(format){
    case "YYYY-MM-DD":
      converted_date = year + "-" + month + "-" + date;
      break;
    case "YYYY-MMM-DD DDD":
      converted_date = year + "-" + months[parseInt(month)-1] + "-" + date + " " + dates[parseInt(day)];
      break;
  }

  return converted_date;
}

var date=new Date();
var format = "YYYY-MM-DD";
var strfecha;

router.get('/tiempo', function(req, res, next) {
    strfechaActual = dateConvert(date,format);
    var labels = [];
    var numero = [];
    var fechasBusqueda = [];
    var dias  = req.query.dias;
    if (req.user) {
        if (req.user.rol === 'Administrador'){
            for (var i = 0; i < dias; i++) {
                var fechaCambiante = new Date(strfechaActual);
                fechaCambiante.setDate(fechaCambiante.getDate() - (dias-2-i));
                fechasBusqueda.push(dateConvert(fechaCambiante,format));
            }
            EjercicioResuelto.getReporteEjercicios(fechasBusqueda, function(err, resultados) {
                resultados.reverse();
                if (resultados.length > 0) {
                    for (var i = 0, len = resultados.length; i < len; i++) {
                        labels.push(resultados[i].fecha);
                        numero.push(resultados[i].numejercicio);
                    }
                }
                return res.send(JSON.stringify({ linechart: {labels: labels, data: numero}})); 
            });
        } else
            return res.render('nopermitido');
    } else
        return res.redirect('/login');
});

function largestOfArray(arr, tamanio) {
   var largestNumber = new Array(tamanio+1).join('0').split('').map(parseFloat);;
   for(var arrayIndex = 0; arrayIndex < arr.length; arrayIndex++) {
    for(var subArrayIndex = 0; subArrayIndex < arr[arrayIndex].length; subArrayIndex++) {
       if(arr[arrayIndex][subArrayIndex] > largestNumber[arrayIndex]) {         
          largestNumber[arrayIndex] = arr[arrayIndex][subArrayIndex];
        }
    }
 }
 return largestNumber;
}

function promiseObtenerEjerciciosParalelo(id_Estudiante, index_l, index_m, res, arreglo, paralelo, arr_num_total_ejercicios, contadores) {
                      EstudianteEjercicio.getEstudianteEjercicio(id_Estudiante, function(err, estud) {
                      if(estud.length > 0){
                        arr_num_total_ejercicios[0] = arr_num_total_ejercicios[0] + estud[0].idEjercicios.length; 
                        arreglo[index_l] = arreglo[index_l] + estud[0].idEjercicios.length;
                        contadores[0] += 1;
                      if (contadores[0] === contadores[1]) {
                        var retorno = { estadoMostrar: true, knobChart: {data: arreglo, labels: paralelo, total: arr_num_total_ejercicios[0]}};
                        return res.send(JSON.stringify(retorno));
                      }
                      } else {
                        contadores[0] += 1;
                        arreglo[index_l] = arreglo[index_l] + 0;
                      if (contadores[0] === contadores[1]) {
                        var retorno = { estadoMostrar: true, knobChart: {data: arreglo, labels: paralelo, total: arr_num_total_ejercicios[0]}};
                        return res.send(JSON.stringify(retorno));
                      }
                      }
                    });
}

function removerElementos(arrremove, arr2, arrdevolver, inicio, arrnombresdevolver, nombres) {
  if(inicio){
    for (var i = 0; i < arr2.length; i++) {
      arrdevolver[i] = [];
      arrnombresdevolver[i] = [];
    }
  }
    for (var i = 0; i < arr2.length; i++) {
      var index = arrremove[i].indexOf(arr2[i]);
      arrdevolver[i].push(arrremove[i].splice(index, 1)[0]);
      arrnombresdevolver[i].push(nombres[i].splice(index, 1));
    }
    return arrremove;
}

function promiseObtenerMejoresEstudiantes(id_Estudiante, index_l, index_m, res, puntajes_paralelo, paralelo, contadores, jsonObj, nombreEstudiantesParalelo) {
                      EstudiantePuntos.getEstudiantePunto(id_Estudiante, function(err, estud) {
                      if(estud.length > 0){
                        puntajes_paralelo[index_l][index_m] = estud[0].puntos;
                        contadores[0] += 1;
                        console.log("Contador " + contadores[0]);
                        console.log("Contador final " + contadores[1]);
                      if (contadores[0] === contadores[1]) {
                        var devolver = [];
                        var devolvernombres = [];
                        var inicio = true;
                        for (var i = 0; i < 3; i++) {
                          console.log("ANTESSSSSSSSS");
                          var arrayMejoresPuntos = largestOfArray(puntajes_paralelo, nombreEstudiantesParalelo.length)
                          console.log("MEJORES");
                          console.log(arrayMejoresPuntos);
                          console.log("Puntajes");
                          console.log(puntajes_paralelo);
                          console.log("DEvolver");
                          console.log(devolver);
                          if(i == 0) inicio = true;
                          else inicio = false;
                          puntajes_paralelo = removerElementos(puntajes_paralelo, arrayMejoresPuntos, devolver, inicio, devolvernombres, nombreEstudiantesParalelo)
                          console.log("DESPUESSSSSSSS");
                          console.log("MEJORES");
                          console.log(arrayMejoresPuntos);
                          console.log("Puntajes");
                          console.log(puntajes_paralelo);
                          console.log("DEvolver");
                          console.log(devolver);
                        }
                        var retorno = { estadoMostrar: true, data: {paralelos: paralelo, puntajes: devolver, nombres: devolvernombres}};
                        return res.send(JSON.stringify(retorno));
                      }
                      } else {
                        puntajes_paralelo[index_l][index_m] = 0;
                        contadores[0] += 1;
                      if (contadores[0] === contadores[1]) {
                        var devolver = [];
                        var devolvernombres = [];
                        var inicio = true;
                        for (var i = 0; i < 3; i++) {
                          console.log("ANTESSSSSSSSS");
                          var arrayMejoresPuntos = largestOfArray(puntajes_paralelo, nombreEstudiantesParalelo.length)
                          console.log("MEJORES");
                          console.log(arrayMejoresPuntos);
                          console.log("Puntajes");
                          console.log(puntajes_paralelo);
                          console.log("DEvolver");
                          console.log(devolver);
                          if(i == 0) inicio = true;
                          else inicio = false;
                          puntajes_paralelo = removerElementos(puntajes_paralelo, arrayMejoresPuntos, devolver, inicio, devolvernombres, nombreEstudiantesParalelo)
                          console.log("DESPUESSSSSSSS");
                          console.log("MEJORES");
                          console.log(arrayMejoresPuntos);
                          console.log("Puntajes");
                          console.log(puntajes_paralelo);
                          console.log("DEvolver");
                          console.log(devolver);
                        }
                        var retorno = { estadoMostrar: true, data: {paralelos: paralelo, puntajes: devolver, nombres: devolvernombres}};
                        return res.send(JSON.stringify(retorno));
                      }
                      }
                    });
}

router.get('/mejores', function(req, res, next) {
  var numero_paralelos = 0;
  var num_estudiantes_paralelo = [];
  var puntajes_paralelo = [];
  var idEstudiantesParalelo = [];
  var nombreEstudiantesParalelo = [];
  var nombres_paralelo = [];
  var apellidos_paralelo = [];
  var nombres = [];
  var apellidos = [];   
  var datos = [];
  var paralelo = [];
  var contadores = [];
  var jsonObj = {};
  Cursos.find(function(err, cursos) {
    if(cursos.length > 0) {
      numero_paralelos = cursos.length;
      for (var i = 0; i < cursos.length; i++) {
        paralelo[i] = cursos[i].paralelo;
        var estudiantes = cursos[i].estudiantes.split(',');
        num_estudiantes_paralelo.push(estudiantes.length);
        nombres = [];
        apellidos = [];
        for (var j = 0; j < estudiantes.length; j++) {
          var nombreEstudiante = estudiantes[j].split(' ');
          if (nombreEstudiante.length <= 3) {
            nombres.push(nombreEstudiante[0]);
            apellidos.push(nombreEstudiante[1] + ' ' + nombreEstudiante[2]);
          } else {
            nombres.push(nombreEstudiante[0] + ' ' + nombreEstudiante[1]);
            apellidos.push(nombreEstudiante[2] + ' ' + nombreEstudiante[3]);
          }
        }
        nombres_paralelo.push(nombres);
        apellidos_paralelo.push(apellidos);  
      }
        for (var k = 0; k < nombres_paralelo.length; k++) {
            Usuario.getUsuarioNombre(nombres_paralelo[k], apellidos_paralelo[k], function(err, estudiante) {
              var idEstudiantes = [];
              var nombreEstudiantes = [];
              if(estudiante.length > 0) {
                for (var i = 0; i < estudiante.length; i++) {
                  idEstudiantes.push(estudiante[i]._id);
                  nombreEstudiantes.push(estudiante[i].nombres + " " + estudiante[i].apellidos)
                }
                idEstudiantesParalelo.push(idEstudiantes);
                nombreEstudiantesParalelo.push(nombreEstudiantes);
              }
              if(idEstudiantesParalelo.length == nombres_paralelo.length) {
                var l;
                var m;
                var v1 = idEstudiantesParalelo.length-1; 
                var v2 = idEstudiantesParalelo[v1].length-1;
                contadores[1] = (v1+1) * (v2+1);
                contadores[0] = 1;
                puntajes_paralelo = new Array(idEstudiantesParalelo.length + 1).join('0').split('').map(parseFloat);
                for (var i = 0; i < puntajes_paralelo.length; i++) {
                  puntajes_paralelo[i] = new Array(idEstudiantesParalelo[i].length + 1).join('0').split('').map(parseFloat)
                }

                for (l = 0; l < idEstudiantesParalelo.length; l++) {
                  for (m = 0; m < idEstudiantesParalelo[l].length; m++) {
                    contadores[0] = 0;
                    promiseObtenerMejoresEstudiantes(idEstudiantesParalelo[l][m], l, m, res, puntajes_paralelo, paralelo, contadores, jsonObj, nombreEstudiantesParalelo);
                  }
                }
              }
            });
        }
    } else {
      return res.send(JSON.stringify({ estadoMostrar: false, contenidoMSG: "No hay cursos registrados"}));
    }
  });
});

router.get('/paralelos', function(req, res, next) {
  var numero_paralelos = 0;
  var num_estudiantes_paralelo = [];
  var num_ejercicios_resueltos_paralelo = [];
  var idEstudiantesParalelo = [];
  var nombres_paralelo = [];
  var apellidos_paralelo = [];
  var nombres = [];
  var apellidos = [];   
  var datos = [];
  var paralelo = [];
  var arr_num_total_ejercicios = [0]
  var contadores = [];
  var contador_ids = 0;
  var contador_ids2 =0;
  Cursos.find(function(err, cursos) {
    if(cursos.length > 0) {
      for (var i = 0; i < cursos.length; i++) {
                  idEstudiantesParalelo[i] =[];
      }
                //       console.log("IDS INICIAL")
                // console.log(idEstudiantesParalelo);
      numero_paralelos = cursos.length;
      for (var i = 0; i < cursos.length; i++) {
        paralelo[i] = cursos[i].paralelo;
        var estudiantes = cursos[i].estudiantes.split(',');
        num_estudiantes_paralelo.push(estudiantes.length);
        nombres = [];
        apellidos = [];
        for (var j = 0; j < estudiantes.length; j++) {
          var nombreEstudiante = estudiantes[j].split(' ');
          if (nombreEstudiante.length <= 3) {
            nombres.push(nombreEstudiante[0]);
            apellidos.push(nombreEstudiante[1] + ' ' + nombreEstudiante[2]);
          } else {
            nombres.push(nombreEstudiante[0] + ' ' + nombreEstudiante[1]);
            apellidos.push(nombreEstudiante[2] + ' ' + nombreEstudiante[3]);
          }
        }
        nombres_paralelo.push(nombres);
        apellidos_paralelo.push(apellidos);  
      }
      for (var s = 0; s < nombres_paralelo.length; s++) {
        contador_ids2 += nombres_paralelo[s].length;
      }
      var indexid = 0;
        for (var k = 0; k < nombres_paralelo.length; k++) {
            Usuario.getUsuarioNombre(nombres_paralelo[k], apellidos_paralelo[k], function(err, estudiante) {
              var idEstudiantes = [];
              var nombresEstudiantes = [];
              var apellidosEstudiantes = [];
              var contadorcorrecto = 0;
              if(estudiante.length > 0) {
                for (var i = 0; i < estudiante.length; i++) {
                  idEstudiantes.push(estudiante[i]._id);
                  contador_ids = contador_ids + 1;
                }
                for (var i = 0; i < estudiante.length; i++) {
                  nombresEstudiantes.push(estudiante[i].nombres);
                  apellidosEstudiantes.push(estudiante[i].nombres);
                }
                console.log("NOMBRES ESTUDIANTES")
                console.log(nombresEstudiantes);
                console.log("IDS para agregar");
                console.log(idEstudiantes);
                for (var i = 0; i < cursos.length; i++) {
                  console.log("---------------------");
                  console.log("---------------------");
                  console.log("---------------------");
                  console.log("Curso estudiantes: " + cursos[i].estudiantes);
                  contadorcorrecto = 0;
                  for (var j = 0; j < estudiante.length; j++) {
                    if(cursos[i].estudiantes.indexOf(nombresEstudiantes[j]) !== -1 && cursos[i].estudiantes.indexOf(apellidosEstudiantes[j]) !== -1) {
                      contadorcorrecto += 1;
                    }
                  }
                  console.log("Contador correcto " + contadorcorrecto);
                  console.log("Contador verificar " + cursos[i].estudiantes.split(',').length);
                  if(contadorcorrecto == cursos[i].estudiantes.split(',').length){
                    idEstudiantesParalelo[i] = idEstudiantes.slice();
                    console.log("Cursos");
                    console.log(cursos);
                    cursos[i].estudiantes = "";
                    console.log("Cursos despues");
                    console.log(cursos);
                    console.log("Index: " + i)
                    console.log("IDS");
                    console.log(idEstudiantesParalelo);
                    i = cursos.length;
                    contadorcorrecto = 0;
                  }
                }
                // idEstudiantesParalelo.push(idEstudiantes);
              } else {
                contadores[0] += 1;
              }


              if(contador_ids == contador_ids2) {
              console.log("IDS");
              console.log(idEstudiantesParalelo);
                var l;
                var m;
                contadores[1] = contador_ids;
                contadores[0] = 1;
                arr_num_total_ejercicios[0] = 0;
                num_ejercicios_resueltos_paralelo = new Array(idEstudiantesParalelo.length + 1).join('0').split('').map(parseFloat);
                for (l = 0; l < idEstudiantesParalelo.length; l++) {
                  for (m = 0; m < idEstudiantesParalelo[l].length; m++) {
                    if(m == 0)
                      num_ejercicios_resueltos_paralelo[l] = 0;
                    contadores[0] = 0;
                    // contador = 0;
                    promiseObtenerEjerciciosParalelo(idEstudiantesParalelo[l][m], l, m, res, num_ejercicios_resueltos_paralelo, paralelo, arr_num_total_ejercicios, contadores);
                  }
                }
              } else {
                contadores[0] += 1;
              }
            });
        }
    } else {
      var retorno = { estadoMostrar: true, knobChart: {data: num_ejercicios_resueltos_paralelo, labels: paralelo, total: arr_num_total_ejercicios[0]}};
      return res.send(JSON.stringify(retorno));
    }
  });
});

module.exports = router;