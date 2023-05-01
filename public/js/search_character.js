// Get the objects we need to modify
let searchCharacterForm = document.getElementById("search-character-form-ajax");
let searchCharacterList = document.getElementById("booksList");

// Modify the objects we need
searchCharacterForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Remove any prior search results
    removeAllChildNodes(searchCharacterList);

    // Get form fields we need to get data from
    let inputCharacter = document.getElementById("charSelect");

    // Get the values from the form fields
    let inputCharacterValue = inputCharacter.value;

    // Put our data we want to send in a javascript object
    let data = {
        id: inputCharacterValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/search-character-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // modify to build table, vs. one row? see buildTable below
            // addRowToTable(xhttp.response); commented out to test
            buildList(xhttp.response);

            // Clear the input fields for another transaction
            // inputCharacter.value = 'test';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Update the list with all book appearances
buildList = (data) => {
    let list = document.getElementById("booksList");
    let parsedData = JSON.parse(data);

    for (var i = 0; i < parsedData.length; i++) {
        let listItem = document.createElement("li");
        listItem.innerText = parsedData[i].title;
        list.appendChild(listItem);
    }
}

// Removes all child nodes for a given parent
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
