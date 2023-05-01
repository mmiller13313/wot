// Get the objects we need to modify
let addBookForm = document.getElementById('addBooksForm');

// Modify the objects we need
addBookForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let titleInput = document.getElementById("titleInput");
    let pubDateInput = document.getElementById("pubDateInput");
    let lengthInput = document.getElementById("lengthInput");
    let bookNumberInput = document.getElementById("bookNumberInput");

    // Get the values from the form fields
    let titleInputValue = titleInput.value;
    let pubDateInputValue = pubDateInput.value;
    let lengthInputValue = lengthInput.value;
    let bookNumberInputValue = bookNumberInput.value;

    // Put our data we want to send in a javascript object
    let data = {
        titleInput: titleInputValue,
        pubDateInput: pubDateInputValue,
        lengthInput: lengthInputValue,
        bookNumberInput: bookNumberInputValue
        
    }
    
    

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_book", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);


            // Clear the input fields for another transaction
            titleInput.value = '';
            pubDateInput.value = '';
            lengthInput.value = '';
            bookNumberInput.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single new row for the table
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("books_table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row, cells, button, and form
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let titleCell = document.createElement("TD");
    let pubDateCell = document.createElement("TD");
    let lengthCell = document.createElement("TD");
    let bookNumCell = document.createElement("TD");
    let manageCell = document.createElement("TD") 
    let manageButton = document.createElement("button")
    let manageForm = document.createElement("form");

    // Handle date formating
    let pubDate = new Date(newRow.pubDate);
    let day = pubDate.getDate()
    if (day.toString().length === 1) {
        day = "0" + day;
    }
    let month = pubDate.getMonth()
    month = month + 1;
    if (month.toString().length === 1) {
        month = "0" + month;
    }


    // Fill the cells with correct data and create buttons
    idCell.innerText = newRow.bookId;
    titleCell.innerText = newRow.title;
    pubDateCell.innerText = month + "-" + day + "-" + pubDate.getFullYear();
    lengthCell.innerText = newRow.length;
    bookNumCell.innerText = newRow.bookNumber;
    manageButton.innerText = "Manage Relationships";
    manageButton.name = "bookId";
    manageButton.value = newRow.bookId;
    manageButton.id = "manage" + newRow.bookId;
    manageForm.appendChild(manageButton);
    manageForm.action = "managebooks";
    manageForm.method = "get";
    manageCell.appendChild(manageForm);


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(pubDateCell);
    row.appendChild(lengthCell);
    row.appendChild(bookNumCell);
    row.appendChild(manageCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}