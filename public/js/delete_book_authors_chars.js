// This file allows deleting authors or characters from Books

// This function is for deleting authors associated with Books
function deleteBooksAuthor(authorId, bookId) {
    // Package data to send
    let data = {
        authorId: authorId,
        bookId: bookId
    };

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete_book_author", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell request what tod o when success or failure
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
             // Reload the page
             location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("Error deleting relationship.");
        }
    }

    // Send the request
    xhttp.send(JSON.stringify(data));

}

// This function is for deleting characters associated with books
function deleteBooksChar(characterId, bookId) {
    // Package data to send
    let data = {
        characterId: characterId,
        bookId: bookId
    };

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete_book_char", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell request what tod o when success or failure
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
             // Reload the page
             location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("Error deleting relationship.");
        }
    }

    // Send the request
    xhttp.send(JSON.stringify(data));

}


