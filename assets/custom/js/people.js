function getPeopleData() {
    $.ajax({
        method: "GET",
        url: "http://3.14.150.169:8080/getPeople"
    }).fail(function (e) {
        document.getElementById("tableBody").innerText = "Hi ha problemes amb la connexió, si us plau, contacteu amb l'administrador."
        console.log("Problemes de connexió: " + e);
    }).done(function (data) {
        try {
            var dataParsed = JSON.parse(data);
            createPeopleTable(dataParsed);
        } catch (e) {
            console.log(e);
            document.getElementById("tableBody").innerText = "No es pot proporcionar la informació...";
        }
    });
}

function createPeopleTable(data) {
    var tableBody = document.getElementById("tableBody");
    var tableHeader = document.getElementById("tableHeader");
    var columns = ["photo", "name", "device", "date"];
    var columnsName = ["Foto", "Nom", "Dispositiu", "Data"];


    tableHeader.appendChild(getHeadersRow(columnsName)); // Fa l'append de l'element tr creat a la funció

    for (var i = 0; i < data.length; i++) {
        var row = document.createElement("TR");

        fieldsLoop: for (var j = 0; j < columns.length; j++) {
            var field = document.createElement("TD");
            var columnName = columns[j];
            var value = data[i][columnName];
            var content = "Sense dades";

            if (columnName == "photo") {
                if (value != null && value !== "") {
                    var image = new Image();
                    image.src = value;
                    image.classList.add("profile-image");

                    field.appendChild(image);
                    row.appendChild(field);
                    continue fieldsLoop;
                } else content = "No té foto";

            } else {
                content = value != null ? value : "Sense dades";
            }
            field.appendChild(document.createTextNode(content));
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
