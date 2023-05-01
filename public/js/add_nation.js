// Get the objects we need to modify
let addNationForm = document.getElementById('addNationForm');

// Modify the objects we need
addNationForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputNationName = document.getElementById("nationName");
    let inputDemonym = document.getElementById("demonym");
    let inputRegion = document.getElementById("region");
    let inputCapital = document.getElementById("capital");
    let inputSigil = document.getElementById("sigil");

    // Get the values from the form fields
    let nationNameValue = inputNationName.value;
    let demonymValue = inputDemonym.value;
    let regionValue = inputRegion.value;
    let capitalValue = inputCapital.value;
    let sigilValue = inputSigil.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nationNameValue,
        demonym: demonymValue,
        region: regionValue,
        capital: capitalValue,
        sigil: sigilValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-nation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputNationName.value = '';
            inputDemonym.value = '';
            inputRegion.value = '';
            inputCapital.value = '';
            inputSigil.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Nations
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("browseNationsTable");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 8 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nationNameCell = document.createElement("TD");
    let demonymCell = document.createElement("TD");
    let regionCell = document.createElement("TD");
    let capitalCell = document.createElement("TD");
    let sigilCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.nationId;
    nationNameCell.innerText = newRow.name;
    demonymCell.innerText = newRow.demonym;
    regionCell.innerText = newRow.region;
    capitalCell.innerText = newRow.capital;
    sigilCell.innerText = newRow.sigil;
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteNation(newRow.nationId)
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nationNameCell);
    row.appendChild(demonymCell);
    row.appendChild(regionCell);
    row.appendChild(capitalCell);
    row.appendChild(sigilCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.nationId);
    
    // Add the row to the table
    currentTable.appendChild(row);
}