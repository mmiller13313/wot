// Get the objects we need to modify
let updateCharacterForm = document.getElementById("update-character-form-ajax");

// Modify the objects we need
updateCharacterForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("mySelect");
    let inputNationality = document.getElementById("input-nationality-update");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let nationalityValue = inputNationality.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being passed NULL for homeworld

    // if (isNaN(homeworldValue)) 
    // {
    //     return;
    // }

    // if (isNaN(nationalityValue)){
    //     nationalityValue = NULL;
    // }

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        nationality: nationalityValue,
    }
    
    console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-character-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, nameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, characterId){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("browseCharactersTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == characterId) {

            // Get the location of the row where we found the matching character Id
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of nationality value
            let td = updateRowIndex.getElementsByTagName("td")[7];

            // Reassign nationality to our value we updated to or null
            if (parsedData[0]) {
                td.innerHTML = parsedData[0].nationId; 
            } else {
                td.innerHTML = "";
            }
            
       }
    }
}