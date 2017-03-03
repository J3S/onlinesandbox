$(document).ready(function() {
	$('#agregarE').click(function(){
		var estudiante = $("#estudiantes").val();
		//console.log(estudiante);
		var cont = 0;
		$.ajax({
            url: "/cursos/crear/obtener",
            dataType: "json",
            success: function (data) {
              
                $.map(data, function(v,i){
                  var est = v.nombres + " " + v.apellidos;

                  if (est == estudiante){
                    console.log("entra");
                 	cont = 1;

                  }
                });
                
		        if (cont == 0){
		        	$("#msg-estudiantes").removeClass("hidden");
		            $("#estudiantes-group").addClass("has-error");
		        } else if (estudiante != ""){
		        	$("#msg-estudiantes").addClass("hidden");
		            $("#estudiantes-group").removeClass("has-error");
		        	$('#lista-group').append('<div class="row"><div class="col-sm-4 col-md-4" id="estd">'+estudiante+'</div><button class="btn btn-danger quitar-entrada" data-target="div' + estudiante + '">Quitar</button><input type="hidden" name="est" value="'+estudiante+'"></div>');
		        	$("#estudiantes").val("");

		        }
            }
        });

        

	});

	$('body').on('click', '.quitar-entrada', function() {
        $(this).parent().remove();
        $()
    });


    
});