// Get the objects we need to modify
let addAuthorForm = document.getElementById('addAuthorForm');

// Modify the objects we need
addAuthorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFName = document.getElementById("fName");
    let inputMName = document.getElementById("mName");
    let inputLName = document.getElementById("lName");
    let inputSuffix = document.getElementById("suffix");
    let inputPenName = document.getElementById("penName");
    let inputBirth = document.getElementById("birth");
    let inputDeath = document.getElementById("death");

    // Get the values from the form fields
    let fNameValue = inputFName.value;
    let mNameValue = inputMName.value;
    let lNameValue = inputLName.value;
    let suffixValue = inputSuffix.value;
    let penNameValue = inputPenName.value;
    let birthValue = inputBirth.value;
    let deathValue = inputDeath.value;

    // Put our data we want to send in a javascript object
    let data = {
        fName: fNameValue,
        mName: mNameValue,
        lName: lNameValue,
        suffix: suffixValue,
        penName: penNameValue,
        birth: birthValue,
        death: deathValue
    }

    console.log(data.mName);
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            fName.value = '';
            mName.value = '';
            lName.value = '';
            suffix.value = '';
            penName.value = '';
            birth.value = '';
            death.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log(JSON.stringify(data));
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Nations
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("browseAuthorTable");


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
    let penNameCell = document.createElement("TD");
    let birthCell = document.createElement("TD");
    let deathCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");


    // Handle date formating for birth and death
    let birth = new Date(newRow.birth);
    let birthDay = birth.getDate()
    if (birthDay.toString().length === 1) {
        birthDay = "0" + birthDay;
    }
    let birthMonth = birth.getMonth()
    birthMonth = birthMonth + 1;
    if (birthMonth.toString().length === 1) {
        birthMonth = "0" + birthMonth;
    }

    // Make sure there was a death day
    let deathDate = ""
    console.log(newRow.death);
    if (newRow.death != "0000-00-00" && newRow.death !== null) {
        let death = new Date(newRow.death);
        console.log(death);
        let deathDay = death.getDate()
        if (deathDay.toString().length === 1) {
            deathDay = "0" + deathDay;
        }
        let deathMonth = birth.getMonth()
        deathMonth = deathMonth + 1;
        if (deathMonth.toString().length === 1) {
            deathMonth = "0" + deathMonth;
        }
        deathDate = deathMonth + "-" + deathDay + "-" + death.getFullYear();
    }

    console.log(deathDate);

    // Fill the cells with correct data
    idCell.innerText = newRow.authorId;
    fNameCell.innerText = newRow.fName;
    mNameCell.innerText = newRow.mName;
    lNameCell.innerText = newRow.lName;
    suffixCell.innerText = newRow.suffix;
    penNameCell.innerText = newRow.penName;
    birthCell.innerText = birthMonth + "-" + birthDay + "-" + birth.getFullYear();
    deathCell.innerText = deathDate;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteAuthor(newRow.authorId)
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(fNameCell);
    row.appendChild(mNameCell);
    row.appendChild(lNameCell);
    row.appendChild(suffixCell);
    row.appendChild(penNameCell);
    row.appendChild(birthCell);
    row.appendChild(deathCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.authorId);
    
    // Add the row to the table
    currentTable.appendChild(row);

}