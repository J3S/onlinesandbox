$(function() {
    var contador_entrada = 0;
    var contador_etiqueta = 0;
    $("mensaje-operacion").hide();

    function agregarDatos(nameElement, nameDivContainer, className) {
        var contador;
        var data = $(nameElement).val();
        if (className === "entrada") {
            contador_entrada += 1;
            contador = contador_entrada;
        } else {
            contador_etiqueta += 1;
            contador = contador_etiqueta;
            data = $(nameElement + " :selected").text();
        }
        var divAgregados = $(nameDivContainer);
        if (data !== "" && !$(nameElement).val() === false) {
            if (divAgregados.children().length === 1) {
                var row = $('<div class="row" style="margin-bottom:10px;" id="div' + data + '"></div>');
                var label = $('<div class="col-xs-8"><label>' + data + '</label></div>');
                var button = $('<button type="button" class="btn btn-danger quitar-' + className + '" data-target="div' + data + '" >Quitar</button>');
                var input = $('<input type="text" name="' + className + contador + '" value="' + data + '" hidden class="' + className + '">');
                row.append(label);
                row.append(button);
                row.append(input);
                divAgregados.append(row);
            } else {
                var children = divAgregados.children();
                var id = "div" + data;
                var agregado = false;
                for (var i = 1; i < children.length; i++) {
                    if (id === children[i].id) agregado = true;
                }
                if (!agregado) {
                    var row = $('<div class="row" style="margin-bottom:10px;" id="div' + data + '"></div>');
                    var label = $('<div class="col-xs-8"><label>' + data + '</label></div>');
                    var button = $('<button type="button" class="btn btn-danger quitar-' + className + '" data-target="div' + data + '">Quitar</button>');
                    var input = $('<input type="text" name="' + className + contador + '" value="' + data + '" hidden class="' + className + '">');
                    row.append(label);
                    row.append(button);
                    row.append(input);
                    divAgregados.append(row);
                }
            }
        }
    }

    $('#agregar-entrada').click(function() {
        agregarDatos("#entrada", "#entrada-agregados", "entrada");
    });
    $('#agregar-etiqueta').click(function() {
        agregarDatos("#etiquetas", "#etiquetas-agregadas", "etiqueta");
    });

    $('body').on('click', '.quitar-entrada', function() {
        $(this).parent().remove();
    });
    $('body').on('click', '.quitar-etiqueta', function() {
        $(this).parent().remove();
    });

    $('#editar-ejercicio').click(function (event) {
        event.preventDefault();
        var titulo = $("#titulo").val();
        var descripcion = $("#descripcion").val();
        var divEtiquetasAgregadas = $("#etiquetas-agregadas");
        var divEntradasAgregadas = $("#entrada-agregados");
        var salida = $("#salida").val();
        var dificultad = $("#dificultad :selected").text();
        var camposLlenos = 0;
        var campoTitulo, campoDescripcion, campoEntrada, campoSalida, campoEtiqueta, campoDificultad;

        if (titulo === "") {
            $("#msg-titulo").removeClass("hidden");
            $("#titulo-group").addClass("has-error");
            campoTitulo = 0;
        } else {
            $("#msg-titulo").addClass("hidden");
            $("#titulo-group").removeClass("has-error");
            campoTitulo = 1;
        }
        if (descripcion === "") {
            $("#msg-descripcion").removeClass("hidden");
            $("#descripcion-group").addClass("has-error");
            campoDescripcion = 0;
        } else {
            $("#msg-descripcion").addClass("hidden");
            $("#descripcion-group").removeClass("has-error");
            campoDescripcion = 1;
        }
        if (divEtiquetasAgregadas.children().length === 1) {
            $("#msg-etiquetas").removeClass("hidden");
            $("#etiquetas-group").addClass("has-error");
            campoEtiqueta = 0;
        } else {
            $("#msg-etiquetas").addClass("hidden");
            $("#etiquetas-group").removeClass("has-error");
            campoEtiqueta = 1;
        }
        if (divEntradasAgregadas.children().length === 1) {
            campoEntrada = 0;
        } else {
            campoEntrada = 1;
        }
        if (salida === "") {
            $("#msg-salida").removeClass("hidden");
            $("#salida-group").addClass("has-error");
            campoSalida = 0;
        } else {
            $("#msg-salida").addClass("hidden");
            $("#salida-group").removeClass("has-error");
            campoSalida = 1;
        }
        if (dificultad === "") {
            $("#msg-dificultad").removeClass("hidden");
            $("#dificultad-group").addClass("has-error");
            campoDificultad = 0;
        } else {
            $("#msg-dificultad").addClass("hidden");
            $("#dificultad-group").removeClass("has-error");
            campoDificultad = 1;
        }

        camposLlenos = campoTitulo + campoDescripcion + campoEntrada + campoSalida + campoEtiqueta + campoDificultad;
        dificultad = $("#dificultad").val();
        if ((camposLlenos === 5 && divEntradasAgregadas.children().length === 1) || camposLlenos  > 5) {
            var jsonEntrada = [];
            $('.entrada').each(function(index, object) {
                var entrada = {};
                entrada["valor"] = $(object).val();
                jsonEntrada.push(entrada);
            });
            var jsonEtiquetas = [];
            $('.etiqueta').each(function(index, object) {
                var etiqueta = {};
                etiqueta["valor"] = $(object).val();
                jsonEtiquetas.push(etiqueta);
            });

            var datos_enviados = {};
            datos_enviados.titulo = titulo;
            datos_enviados.descripcion = descripcion;
            datos_enviados.entradas = JSON.stringify(jsonEntrada);
            datos_enviados.etiquetas = JSON.stringify(jsonEtiquetas);
            datos_enviados.salida = salida;
            datos_enviados.dificultad = dificultad;
            $.ajax({
                url: "/ejercicios" + window.location.href.split("/ejercicios")[1],
                type: "PUT",
                cache: false,
                data: datos_enviados,
                dataType: "json",
                success: function(data){
                    if (data.estadoError) {
                        $("#alert").html('<div class="alert alert-danger alert-dismissible fade in" role="alert" id="mensaje-operacion"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + data.contenidoMSG + '</div>');
                        $("#alert").show();
                    } else {
                        $("#alert").html('<div class="alert alert-success alert-dismissible fade in" role="alert" id="mensaje-operacion"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + data.contenidoMSG + '</div>');
                        $("#alert").show();
                    }
                  },
                  error: function( XMLHttpRequest, textStatus, errorThrown){
                  }
              });
        }
    });

});