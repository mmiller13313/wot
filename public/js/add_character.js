// Get the objects we need to modify
let addCharacterForm = document.getElementById('addCharacterForm');

// Modify the objects we need
addCharacterForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFName = document.getElementById("fName");
    let inputMName = document.getElementById("mName");
    let inputLName = document.getElementById("lName");
    let inputSuffix = document.getElementById("suffix");
    let inputGender = document.getElementById("gender");
    let inputFirstAppeared = document.getElementById("firstAppeared");
    let inputNationality = document.getElementById("nationality");

    // Get the values from the form fields
    let fNameValue = inputFName.value;
    let mNameValue = inputMName.value;
    let lNameValue = inputLName.value;
    let suffixValue = inputSuffix.value;
    let genderValue = inputGender.value;
    let firstAppearedValue = inputFirstAppeared.value;
    let nationalityValue = inputNationality.value;

    // Put our data we want to send in a javascript object
    let data = {
        fName: fNameValue,
        mName: mNameValue,
        lName: lNameValue,
        suffix: suffixValue,
        gender: genderValue,
        firstAppeared: firstAppearedValue,
        nationality: nationalityValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-character-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFName.value = '';
            inputMName.value = '';
            inputLName.value = '';
            inputSuffix.value = '';
            inputGender.value = '';
            inputFirstAppeared.value = '';
            inputNationality.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Characters
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("browseCharactersTable");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 8 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let fNameCell = document.createElement("TD");
    let mNameCell = document.createElement("TD");
    let lNameCell = document.createElement("TD");
    let suffixCell = document.createElement("TD");
    let genderCell = document.createElement("TD");
    let firstAppearedCell = document.createElement("TD");
    let nationalityCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.characterId;
    fNameCell.innerText = newRow.fName;
    mNameCell.innerText = newRow.mName;
    lNameCell.innerText = newRow.lName;
    suffixCell.innerText = newRow.suffix;
    genderCell.innerText = newRow.gender;
    firstAppearedCell.innerText = newRow.firstAppeared;
    nationalityCell.innerText = newRow.nationality;
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function (){
        deleteCharacter(newRow.characterId);
    }

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(fNameCell);
    row.appendChild(mNameCell);
    row.appendChild(lNameCell);
    row.appendChild(suffixCell);
    row.appendChild(genderCell);
    row.appendChild(firstAppearedCell);
    row.appendChild(nationalityCell);
    row.appendChild(deleteCell);

    // Add a custom row attribute
    row.setAttribute('data-value', newRow.characterId);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.fName + ' ' + newRow.lName;
    option.value = newRow.characterId;
    selectMenu.add(option);

}