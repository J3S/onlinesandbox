$(document).ready(function() {
	    
	// DataTable
	var table = $('#usuarios').DataTable();
		 
	// Apply the search
	$('input.global_filter').on( 'keyup click', function () {
		$('#usuarios').DataTable().search(
			$('#global_filter').val()
		).draw();
	});
} );