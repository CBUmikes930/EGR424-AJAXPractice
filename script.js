// Populates the keys dropdown with the key values for the selected data set
function getKeysFromSet(type) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            var keys = [];
            document.getElementById("keys").innerHTML = `<option value disabled selected>Select an Option</option>`;
            for (var k in obj[0]) {
                document.getElementById("keys").innerHTML += `<option value="${k}">${k}</option>`;
            }
            
            updateButtonDisabledState();
        }
    };
    xhttp.open("GET", `https://jsonplaceholder.typicode.com/${type}`, true);
    xhttp.send();
};

//Display a list of the selected values from the data set selected using the AJAX method specified
function getValuesFromSetByKey(type, key, ajax_type) {
    if (ajax_type == "XMLHttpRequest") {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(this.responseText);
                var numResults = Object.keys(json).length;
                document.getElementById("display").innerHTML = `<h1>Showing ${key} from ${type} using ${ajax_type} (${numResults} Results):</h1>`;
                for (var k in json) {
                    var obj = json[k];
                    obj = JSON.stringify(obj[key]);
                    document.getElementById("display").innerHTML += `<h4>${obj}</h4>`;
                }
            }
        };
        xhttp.open("GET", `https://jsonplaceholder.typicode.com/${type}`, true);
        xhttp.send();
    } else if (ajax_type == "Fetch") {
        let url = `https://jsonplaceholder.typicode.com/${type}`;
        fetch(url)
            .then(response => response.json())
            .then(json => {
                var numResults = Object.keys(json).length;
                document.getElementById("display").innerHTML = `<h1>Showing ${key} from ${type} using ${ajax_type} (${numResults} Results):</h1>`;
                for (var k in json) {
                    var obj = json[k];
                    obj = JSON.stringify(obj[key]);
                    document.getElementById("display").innerHTML += `<h4>${obj}</h4>`;
                }
            });
    } else if (ajax_type == "AJAX and JQuery") {
        let url = `https://jsonplaceholder.typicode.com/${type}`;
        $.ajax({
            url:url,
            type:"GET",
            dataType:"json",
            success: function (data) {
                var numResults = Object.keys(data).length;
                document.getElementById("display").innerHTML = `<h1>Showing ${key} from ${type} using ${ajax_type} (${numResults} Results):</h1>`;
                for (var k in data) {
                    var obj = data[k];
                    obj = JSON.stringify(obj[key]);
                    document.getElementById("display").innerHTML += `<h4>${obj}</h4>`;
                }
            },
            error: function (data) {
                console.log(data);
            }
        })
    }
}

function updateButtonDisabledState() {
    //Only enable the View button if both all fields are filled in
    $("#view_data").attr("disabled", $("#data_type").val() == null || $("#keys").val() == null);
}

$(document).ready( () => {
    // If we change the data set, then change the keys dropdown to include all keys from that data set
    $("#data_type").on("change", () => {
        let type = $("#data_type").val();
        getKeysFromSet(type);
    });

    // If we change the keys, then check if we can enable the view button
    $("#keys").on("change", updateButtonDisabledState);

    // If the view button is clicked, then run the main function
    $("#view_data").click( () => {
        getValuesFromSetByKey($("#data_type").val(), $("#keys").val(), $("#ajax_type").val());
    });
});