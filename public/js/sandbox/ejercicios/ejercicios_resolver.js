$(function() {
    var entrada = [];
    var salida = "";
    var idEjercicio = "";

    function obtenerEjercicioRandom() {
        var dificultad_env = $("#dificultad :selected").text();
        var etiqueta_env= $("#etiquetas :selected").text();
        $.ajax({
            url: "/ejercicios/ejercicio_random",
            type: "GET",
            data: {
                dificultad: dificultad_env,
                etiqueta: etiqueta_env
            }, success: function(data) {
                var datajson = JSON.parse(data);
                if (!datajson.estadoError) {
                    $("#titulo-ejercicio").text("Título: " + datajson.contenidoMSG.titulo);
                    $("#dificultad-ejercicio").text("Dificultad: " + datajson.contenidoMSG.dificultad.nombre);
                    var etiquetasStr = "";
                    var etiquetasArray = datajson.contenidoMSG.etiquetas;
                    for(var index in etiquetasArray) { 
                        if(index == 0) etiquetasStr = etiquetasStr + etiquetasArray[index].valor;
                        else etiquetasStr = etiquetasStr + ", " + etiquetasArray[index].valor;
                    }

                    entrada = [];
                    var entradasArray = datajson.contenidoMSG.datosEntrada;
                    for(var index in entradasArray) { 
                        entrada.push(entradasArray[index].valor);
                    }

                    salida = "";
                    salida = salida + datajson.contenidoMSG.datosSalida;
                    idEjercicio = datajson.contenidoMSG._id;
                    $("#etiquetas-ejercicio").text("Etiquetas: " + etiquetasStr);
                    $("#descripcion-ejercicio").text("Descripción: " + datajson.contenidoMSG.descripcion);
                    $("#upload").removeClass("hidden");
                } else {
                    $('#titulo-ejercicio').text(datajson.contenidoMSG);
                    $('#dificultad-ejercicio').text("");
                    $('#etiquetas-ejercicio').text("");
                    $('#descripcion-ejercicio').text("");
                    $('#upload').addClass('hidden');
                }
            }
        });
    }

    $('#obtener-ejercicio').click(function (event) {
        event.preventDefault();
        obtenerEjercicioRandom();
    });

    $('#saltar-ejercicio').click(function(event) {
        event.preventDefault();
        obtenerEjercicioRandom();
    });

    $("#resolver-ejercicio").click(function(event) {
        event.preventDefault();
        var formData = new FormData(document.getElementById("form-archivo"));
        formData.append("entradas", entrada);
        formData.append("salida", salida);
        formData.append("idEj", idEjercicio);
        formData.append("dificultad", $("#dificultad :selected").text());
        $.ajax({
            url: "/ejercicios/resolver",
            type: "POST",
            dataType: "html",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                var datajson = JSON.parse(data);
                if (datajson.estado == true) {
                    var dificultad_env = $("#dificultad :selected").text();
                    var puntos = 0;
                    if (dificultad_env === 'Fácil') {
                        puntos = 5;
                    } else if (dificultad_env === 'Intermedio') {
                        puntos = 10;
                    } else {
                        puntos = 15;
                    }
                    $('#titulo-ejercicio').text("");
                    $('#dificultad-ejercicio').text("");
                    $('#etiquetas-ejercicio').text("");
                    $('#descripcion-ejercicio').text("");
                    $('#upload').addClass('hidden');
                    $("#alert").html('<div class="alert alert-success alert-dismissible fade in" role="alert" id="mensaje-operacion"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + datajson.mensaje + '<br /> Has ganado ' + puntos + ' puntos</div>');
                    $("#alert").show();
                } else {
                    $("#alert").html('<div class="alert alert-danger alert-dismissible fade in" role="alert" id="mensaje-operacion"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + datajson.mensaje + '</div>');
                    $("#alert").show();
                }
            }
        });
    });
});