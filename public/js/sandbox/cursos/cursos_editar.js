$('#editarCurso').click(function (event) {
        //event.preventDefault();
        var profesor = $("#profesor").val();
        var paralelo = $("#paralelo").val();
        var exist = $("#estd").length;
        var camposLlenos = 0;
        var campoProfesor, campoParalelo, campoEstudiantes;
        console.log(exist);

        if (profesor === "") {
            $("#msg-profesor").removeClass("hidden");
            $("#profesor-group").addClass("has-error");
            campoProfesor = 0;
        } else {
            $("#msg-profesor").addClass("hidden");
            $("#profesor-group").removeClass("has-error");
            campoProfesor = 1;
        }

        if (paralelo === "") {
            $("#msg-paralelo").removeClass("hidden");
            $("#paralelo-group").addClass("has-error");
            campoParalelo = 0;
        } else {
            $("#msg-paralelo").addClass("hidden");
            $("#paralelo-group").removeClass("has-error");
            campoParalelo = 1;
        }

        if (exist == 0) {
            $("#msg-estudiantes").removeClass("hidden");
            $("#estudiantes-group").addClass("has-error");
            campoEstudiantes = 0;
        } else {
            $("#msg-estudiantes").addClass("hidden");
            $("#estudiantes-group").removeClass("has-error");
            campoEstudiantes = 1;
        }

        var id = $("#idedit").val();
        console.log(id);
        camposLlenos = campoProfesor + campoParalelo + campoEstudiantes;
        
        if (camposLlenos === 3) {
            $("#form-editar").attr("action","/cursos/editar/"+id);
            $("#form-editar").attr("method","post");
            $("#editarCurso").attr("data-toggle","modal");
            $("#editarCurso").attr("data-target","#myModal");
            
        } else {
            event.preventDefault();
        }
});