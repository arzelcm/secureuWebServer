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
    const tableBody = document.getElementById("tableBody");
    const tableHeader = document.getElementById("tableHeader");
    const columns = ["photo", "name", "device", "date", "actions"];
    const columnsName = ["Foto", "Nom", "Dispositiu", "Data", ""];


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

            } else if (columnName == "actions") {
                content = "Here go the actions for each row ";
            } else {
                content = value != null ? value : "Sense dades";
            }
            field.appendChild(document.createTextNode(content));
            row.appendChild(field);
        }

        tableBody.appendChild(row);
    }
    console.log(i);
}

function getHeadersRow(columnsName) {
    const row = document.createElement("TR");

    for (var i = 0; i < columnsName.length; i++) {
        var headerField = document.createElement("TH");
        headerField.appendChild(document.createTextNode(columnsName[i]));
        row.appendChild(headerField);
    }
    return row;
}

function displayAddPersonRow() {
    const addPersonRow = document.getElementById("addPersonRow");
    $(addPersonRow).fadeIn(function () {
        addPersonRow.classList.remove('bounceIn');
    });
}

function hideAddPersonRow() {
    const addPersonRow = document.getElementById("addPersonRow");
    addPersonRow.classList.add('bounceOut');
    $(addPersonRow).fadeOut(function () {
        addPersonRow.classList.remove('bounceOut');
    });
    addPersonRow.classList.add('bounceIn');
    setTimeout(function(){
        cleanAddPersonRow();
    }, 400);
}

function initUploadImageProcess() {
    imageUploader.click();

}

function processImage(files) {
    const imageUploader = document.getElementById("imageUploader");
    const addImageButton = document.getElementById("addImageButton");

    if (files.length == 0) {
        if (addImageButton.classList.contains("inactive")) {
            addImageButton.classList.remove("inactive");
            //Esborrar el camp amb la imatge
        }
    } else if (files.length == 1) {
        //Processar la imatge

        const img = new Image();
        const reader = new FileReader();

        img.crossOrigin = 'Anonymous';
        img.classList.add("personImg", "profile-image");

        reader.readAsDataURL(files[0]);
        reader.onloadend = function () {
            var base64data = reader.result;
            addImageButton.classList.add("inactive")
            img.src = base64data;
        }

        document.getElementById("personImageBox").appendChild(img);
    } else {
        if (files.length > 1) {
            imageUploader.value = "";
            alert("Només es pot pujar 1 imatge");
        }
    }
}

function cleanAddPersonRow() {
    document.getElementById("personImageBox").innerHTML = "";
    document.getElementById("addImageButton").classList.remove("inactive");
    document.getElementById("imageUploader").value = "";
    document.getElementById("nameInput").value = "";
    document.getElementById("surnameInput").value = "";
}

function sendNewPerson() {
    if (document.getElementById("imageUploader").files.length !== 0){
        $.ajax({
            method: "GET",
            url: "http://3.14.150.169:8080/sendNewPerson",
            data: getNewPersonData()
        }).fail(function (e) {
            document.getElementById("tableBody").innerText = "Hi ha problemes amb la connexió, si us plau, contacteu amb l'administrador."
            console.log("Problemes de connexió: " + JSON.stringify(e));
        }).done(function (response) {
            alert(response);
            if (response.trim() === "S'ha afegit correctament") {
                location.reload()
            }
        });
    }
    else {
        alert("Has de pujar una imatge de la persona per a poder completar la funcionalitat");
    }
}

function getNewPersonData() {
    const name = document.getElementById("nameInput").value.trim();
    const surname = document.getElementById("surnameInput").value.trim();
    const image = document.getElementsByClassName("personImg")[0].src; //If any multiple file, will get first



    return data = {
        image: image,
        name: name,
        surname: surname
    }
}
