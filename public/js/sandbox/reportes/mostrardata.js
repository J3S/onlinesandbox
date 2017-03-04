$(document).ready(function() {
    var lineLabel;
    var lineData;
    var lineChart;
    var lineChartCanvas;
    var lineChartOptions;
    var knobData;
    var knobColors;
    var knobLabels;

    $.getJSON("/reportes/tiempo?dias=7", function(data) {
        lineLabel = data.linechart.labels;
        lineData = data.linechart.data;
        dibujarLineChart(lineLabel, lineData);
    });
    $.getJSON("/reportes/paralelos", function(data) {
        console.log(data);
        knobData = data.knobChart.data;
        var total_ejercicios = data.knobChart.total;
        var porcentajes = [];
        for (var i = 0; i < knobData.length; i++) {
            porcentajes[i] = Math.round(knobData[i] * 100 / total_ejercicios);
        }
        knobLabels = data.knobChart.labels;
        dibujarKnobChart(porcentajes, "#f56954", knobLabels, knobData);
        $(".dial").knob();
    });
})

function dibujarLineChart(labelsL, dataL) {
    var areaChartOptions = {
        //Boolean - If we should show the scale at all
        showScale: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: false,
        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - Whether the line is curved between points
        bezierCurve: true,
        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.3,
        //Boolean - Whether to show a dot for each point
        pointDot: true,
        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,
        //Boolean - Whether to fill the dataset with a color
        datasetFill: true,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: true,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true
    };
    var areaChartData = {
        labels: labelsL,
        datasets: [
            {
                fillColor: "rgba(60,141,188,0.9)",
                strokeColor: "rgba(60,141,188,0.8)",
                pointColor: "#3b8bba",
                pointStrokeColor: "rgba(60,141,188,1)",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(60,141,188,1)",
                data: dataL
            }
        ]
    };
    lineChartCanvas = $("#lineChart").get(0).getContext("2d");
    lineChart = new Chart(lineChartCanvas);
    lineChartOptions = areaChartOptions;
    lineChartOptions.datasetFill = false;
    lineChart.Line(areaChartData, lineChartOptions);
}

function resetCanvas (){
  $('#lineChart').remove(); // this is my <canvas> element
  $('#graph-container').append('<canvas id="lineChart" style="height:250px"></canvas>');
  canvas = document.querySelector('#lineChart');
  ctx = canvas.getContext('2d');
  ctx.canvas.width = $('#graph').width(); // resize to parent width
  ctx.canvas.height = $('#graph').height(); // resize to parent height
  var x = canvas.width/2;
  var y = canvas.height/2;
  ctx.font = '10pt Verdana';
  ctx.textAlign = 'center';
  ctx.fillText('This text is centered on the canvas', x, y);
};

$('#btn-dias').click(function() {
    var numero = $('#num-dias').val();
    if(numero !== "") {
        resetCanvas();
        var url = "/reportes/tiempo?dias=" + numero;
        $.getJSON(url, function(data) {
                lineLabel = data.linechart.labels;
                lineData = data.linechart.data;
                dibujarLineChart(lineLabel, lineData);
        });
    } else
    console.log(numero);
});

function dibujarKnobChart(values, color, labels, cantidad) {
    for (var i = 0; i < values.length; i++) {
        var div = $('<div class="col-xs-6 col-md-4 text-center"></div>');
        var input = $('<input type="text" class="dial" data-readonly="true" value="' + values[i] + '" data-width="120" data-height="120" data-fgColor="' + color + '">');
        var label = $('<div class="knob-label">Paralelo ' + labels[i] + ': ' + cantidad[i] + ' ejercicios resueltos</div>');
        div.append(input);
        div.append(label);
        $("#nivel").append(div);
    }
    
}
