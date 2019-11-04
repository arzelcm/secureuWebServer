CHART_COLOR = "#FFFFFF";
DAYS_TO_SUBSTRACT_FROM_DATE = 15;


function getLogData() {
    $.ajax({
        method: "GET",
        url: "http://3.14.150.169:8080/getLogs"
    }).fail(function (e) {
        document.getElementById("tableBody").innerText = "Hi ha problemes amb la connexió, si us plau, contacteu amb l'administrador."
        console.log("Problemes de connexió: " + e);
    }).done(function (data) {
        try {
            var dataParsed = JSON.parse(data);
            printLogTable(dataParsed);
        } catch (e) {
            console.log(e);
            document.getElementById("tableBody").innerText = "No es pot proporcionar la informació...";
        }
    });
}

function initDashboardChart(data) {

    var labels = getLabels();

    var ctx = document.getElementById('bigDashboardChart').getContext("2d");

    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, CHART_COLOR);

    var gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.24)");

    var mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Entrades i/o sortides",
                borderColor: CHART_COLOR,
                pointBorderColor: CHART_COLOR,
                pointBackgroundColor: "#1e3d60",
                pointHoverBackgroundColor: "#1e3d60",
                pointHoverBorderColor: CHART_COLOR,
                pointBorderWidth: 1,
                pointHoverRadius: 7,
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                fill: true,
                backgroundColor: gradientFill,
                borderWidth: 2,
                data: data
            }]
        },
        options: {
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 0,
                    bottom: 0
                }
            },
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: '#fff',
                titleFontColor: '#333',
                bodyFontColor: '#666',
                bodySpacing: 4,
                xPadding: 12,
                mode: "nearest",
                intersect: 0,
                position: "nearest"
            },
            legend: {
                position: "bottom",
                fillStyle: "#FFF",
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "rgba(255,255,255,0.4)",
                        fontStyle: "bold",
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        padding: 10
                    },
                    gridLines: {
                        drawTicks: true,
                        drawBorder: false,
                        display: true,
                        color: "rgba(255,255,255,0.1)",
                        zeroLineColor: "transparent"
                    }

                }],
                xAxes: [{
                    gridLines: {
                        zeroLineColor: "transparent",
                        display: false,

                    },
                    ticks: {
                        padding: 10,
                        fontColor: "rgba(255,255,255,0.4)",
                        fontStyle: "bold"
                    }
                }]
            }
        }
    });
}

function printLogTable(data) {
    var tableBody = document.getElementById("tableBody");
    var tableHeader = document.getElementById("tableHeader");
    var columns = ["name", "device", "log_type", "log_date", "coincidence"];
    var columnsName = ["Nom", "Dispositiu", "Tipus", "Data", "Coincidència"];

    tableHeader.appendChild(getHeadersRow(columnsName)); // Fa l'append de l'element tr creat a la funció

    for (var i = 0; i < data.length; i++) {
        var row = document.createElement("TR");

        for (var j = 0; j < columns.length; j++) {
            var field = document.createElement("TD");

            var columnName = columns[j];
            field.appendChild(document.createTextNode(data[i][columnName]));
            row.appendChild(field);
        }

        tableBody.appendChild(row);
    }
}

function getHeadersRow(columnsName) {
    var row = document.createElement("TR");

    for (var i = 0; i < columnsName.length; i++) {
        var headerField = document.createElement("TH");
        headerField.appendChild(document.createTextNode(columnsName[i]));
        row.appendChild(headerField);
    }
    return row;
}

function getMainChartData() {
    $.ajax({
        method: "GET",
        url: "http://3.14.150.169:8080/getLogsOfTheLast15Days"
    }).done(function (data) {
        try {
            var dataParsed = JSON.parse(data);
        } catch (e) {

        }
        dataGestionsForMainChart(dataParsed);
    });
}

function dataGestionsForMainChart(data) {
    var outputData = [];
    
    for (var i = DAYS_TO_SUBSTRACT_FROM_DATE; i >= 0; i--) {
        var logs = [];
        
        for (var j = 0; j < data.length; j++) {
            if (parseInt(data[j].date_diff) == i) {
                logs.push(data[j]);
            }
        }
        outputData.push(logs.length);
    }

    initDashboardChart(outputData);
}

Date.prototype.substractDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
}

function getLabels() {
    var labels = [];
    var date = new Date();

    for (var i = DAYS_TO_SUBSTRACT_FROM_DATE; i >= 0; i--) {
        var newDate = date.substractDays(i);

        var toPush = newDate.getDate() + " / " + (newDate.getMonth() + 1);
        labels.push(toPush);
    }

    return labels;
}
