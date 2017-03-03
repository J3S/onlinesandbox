$(document).ready(function() {
    var listaEjercicios = $("#lista-ejercicios");
    $.getJSON("/ejercicios/todos", function(data) {
        var status = data.status;
        var contenido = data.contenido;
        $.each(contenido, function(key, value){
            var dificultad = value.dificultad.nombre;
            var idejercicio = value._id;
            var titulo = value.titulo;
            var autor = value.autor.nombres + ' ' + value.autor.apellidos;
            var listadificultad = value.lista;
             var tr = $('<tr></tr>');
            var td1 = $('<td>' + titulo + '</td>'); 
            var td2 = $('<td>' + autor + '</td>'); 
            var td3 = $('<td>' + dificultad + '</td>'); 
            var td4 = $('<td><a href="/ejercicios/editar/' + idejercicio + '" class="col-sm-6 text-center"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</a><a data-url="/ejercicios/borrar/' + idejercicio + '" href="javascript:void(0)" class="col-sm-6 text-center borrar"><i class="fa fa-eraser" aria-hidden="true"></i> Borrar</a></td>');
            tr.append(td1);
            tr.append(td2);
            tr.append(td3);
            tr.append(td4);
            listaEjercicios.append(tr);
        });
        $('#example').DataTable( {
            "language": {
                "lengthMenu": "Mostrar _MENU_ registros por página",
                "zeroRecords": "No se ha encontrado ningún dato",
                "info": "Mostrando página _PAGE_ de _PAGES_",
                "infoEmpty": "Registros no disponibles",
                "infoFiltered": "(filtrado de _MAX_ total records)",
                "sSearch": "Buscar:",
                "oPaginate": {
                  "sFirst": "Primero",
                  "sLast": "Último",
                  "sNext": "Siguiente",
                  "sPrevious": "Anterior"
                }
            }
        });
    });

    $('body').on("click", "a.borrar", function() {
        var url = $(this).data("url");
        $("#borrar-ejercicio").data("url", url);
        $('#myModal').modal('show');
    });

    $("#borrar-ejercicio").click(function() {
        $.ajax({
            url: $("#borrar-ejercicio").data("url"),
            type: "DELETE",
            success: function(data) {
                var datajson = JSON.parse(data);
                $('#myModal').modal('hide');
                if (datajson.estadoError) {
                    $("#alert").html('<div class="alert alert-danger alert-dismissible fade in" role="alert" id="mensaje-operacion"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + datajson.contenidoMSG + '</div>');
                    $("#alert").show();
                } else {
                    $("#alert").html('<div class="alert alert-success alert-dismissible fade in" role="alert" id="mensaje-operacion"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + datajson.contenidoMSG + '</div>');
                    $("#alert").show();
                    var table = $('#example').DataTable();
                    table.clear();
                    $.getJSON("/ejercicios/todos", function(data) {
                        var status = data.status;
                        var contenido = data.contenido;
                        var dataAgregarTabla = [];
                        $.each(contenido, function(key, value){
                            var idejercicio = value._id;
                            var dataAgregar = [];
                            dataAgregar[0] = value.titulo;
                            if(typeof value.autor !== undefined){
                                dataAgregar[1] = "default";
                            } else {
                                dataAgregar[1] = value.autor;
                            }
                            dataAgregar[2] = value.dificultad.nombre;
                            dataAgregar[3] = '<a href="/ejercicios/editar/' + idejercicio + '" class="col-sm-6 text-center"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</a><a data-url="/ejercicios/borrar/' + idejercicio + '" href="javascript:void(0)" class="col-sm-6 text-center borrar"><i class="fa fa-eraser" aria-hidden="true"></i> Borrar</a>';
                            
                            dataAgregarTabla.push(dataAgregar);
                        });
                        table.rows.add(dataAgregarTabla);
                        table.draw();
                    });
                }
            }
        });
    });
});