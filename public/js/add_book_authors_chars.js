// This file allows adding of authors to books or characters to books

// Get the objects we need to modify
let addAuthorForm = document.getElementById('addAuthorForm');

// Modify the objects we need
addAuthorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let authSelection = document.getElementById("authSelect");
    let bookSelection = document.getElementById("addAuthor")

    // Get the values from the form fields
    let authSelectionValue = authSelection.value;
    let bookIdValue = bookSelection.value;

    // Put our data we want to send in a javascript object
    let data = {
        authorId: authSelectionValue,
        bookId: bookIdValue,       
    }
    
    

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_book_author", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Reload the page
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log(JSON.stringify(data));
    xhttp.send(JSON.stringify(data));

})

// Get the objects we need to modify
let addCharForm = document.getElementById('addCharForm');

// Modify the objects we need
addCharForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let charSelection = document.getElementById("charSelect");
    let bookSelection = document.getElementById("addChar")

    // Get the values from the form fields
    let charSelectionValue = charSelection.value;
    let bookIdValue = bookSelection.value;

    // Put our data we want to send in a javascript object
    let data = {
        characterId: charSelectionValue,
        bookId: bookIdValue,       
    }
    
    

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_book_character", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Reload the page
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log(JSON.stringify(data));
    xhttp.send(JSON.stringify(data));

})