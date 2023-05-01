// John Cheshire
// Dominique Lazaros
// Mark Miller
// CS 340 Database
// Project Assignment

// Load express and set up app variable
var express = require('express');
var app = express();

// Set port, json handling, url encoding, and location of static HTML
//const port = require("./database/port.js");
PORT = 7860

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

// Load DB login info # This will be unique
const db = require("./database/db-connector");

// Set up Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
var hbs = require('handlebars');
hbs.registerHelper('dateFormat', require("handlebars-dateformat"));
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

///////////////////////////////
// Display Main Page
///////////////////////////////

app.get('/', function(req, res)
    {
        res.render('index', {"title": "The Wheel of Time Database"});                   
    });     


///////////////////////////////
// Display Authors Page
///////////////////////////////

app.get('/authors', function(req, res)
    {
		let query1 = `SELECT authorId, fName, mName, lName, suffix, penName, birth, DATE_FORMAT(death, '%m-%d-%Y') as death FROM Authors;`;
		db.pool.query(query1, function(error, rows, fields){
        res.render('authors', {data: rows, "title": "The Wheel of Time Database: Authors"});		
    }); 
    });
	
app.post('/add-author-ajax', function(req, res)
{
    let data = req.body;

    // Capture NULL values

    let death = data.death;
    if (death == "")
    {
        death = null;
    }

    query1 = `INSERT INTO Authors (fName, mName, lName, suffix, penName, birth, death) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.pool.query(query1, [data.fName, data.mName, data.lName, data.suffix, data.penName, data.birth, death], function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Authors;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});     

app.delete('/delete-author-ajax', function(req, res, next){
    let data = req.body;
    let authorId = parseInt(data.id);
    let deleteAuthor = `DELETE FROM Authors WHERE authorId = ?`;

    db.pool.query(deleteAuthor, [authorId], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            res.sendStatus(204);
        }
    })
});   	



///////////////////////////////
// Display Books Page
///////////////////////////////

app.get('/books', function(req, res)
{
    let query1 = "SELECT * FROM Books";
    db.pool.query(query1, function(error, rows, fields){
      res.render('books', {title: "The Wheel of Time Database: Books", books: rows});      
    })    
});     


app.post('/add_book', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // // Capture NULL values
    // for (var cur_data in data) {
    //   if (isNaN(parseInt(data[cur_data]))) {
    //     data[cur_data] = "NULL";
    //   }
    // }

    // Create the query and run it on the database
    let query1 = `INSERT INTO Books (title, pubDate, length, bookNumber) VALUES ('${data.titleInput}', '${data.pubDateInput}', '${data.lengthInput}', '${data.bookNumberInput}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
          let query2 = `SELECT * FROM Books`;
          db.pool.query(query2, function(error, rows, fields){

            if (error) {
              console.log(error);
              res.sendStatus(400);
            }
            else {
              res.send(rows);
            }

          })
        }
    })
});

///////////////////////////////
// Display Manage Books Page
///////////////////////////////

app.get('/managebooks', function(req, res)
{

    let bookId = req.query.bookId

    // Query to get authors of books
    let query1 = `SELECT Books.title as title, Authors.fname as fname, Authors.lname as lname, Authors.authorId as authorId, Books.bookId as bookId
    FROM Books INNER JOIN BooksAuthors ON Books.bookId = BooksAuthors.bookId 
    INNER JOIN Authors ON Authors.authorId = BooksAuthors.authorId
    WHERE Books.bookId = '${bookId}'`;

    // Query to get characters in books
    let query2 = `SELECT Books.title as title, fname, lname, Characters.characterId as characterId, Books.bookId as bookId
    FROM Books INNER JOIN BooksCharacters ON Books.bookId = BooksCharacters.bookId 
    INNER JOIN Characters ON BooksCharacters.characterId = Characters.characterId
    WHERE Books.bookId = '${bookId}'`;

    // Get book title
    let query3 = `SELECT title, bookId FROM Books WHERE bookId = ${bookId}`;

    // Get list of characters for dropdown menu
    let query4 = `SELECT characterId, CONCAT(characterID, " - ", fname, " ", lname) as charDisplay 
                FROM Characters WHERE characterId NOT IN (SELECT characterId FROM BooksCharacters WHERE bookId = ${bookId})`;

    // Get list of authors for dropdown menu
    let query5 = `SELECT authorId, CONCAT(authorId, " - ", fname, " ", lname) as authDisplay FROM 
                Authors WHERE authorId NOT IN (SELECT authorId FROM BooksAuthors WHERE bookId = ${bookId})`;    

    db.pool.query(query1, function(error, authorRows, fields){
        db.pool.query(query2, function(error, charRows, fields){
            db.pool.query(query3, function(error, curBook, fields){
                db.pool.query(query4, function(error, allChars, fields){
                    db.pool.query(query5, function(error, allAuthors, fields){
                        res.render('managebooks', 
                            {"title": "The Wheel of Time Database: Manage Books", "authors": authorRows, "characters": charRows,
                             "bookTitle": curBook[0].title, "bookId": curBook[0].bookId, "allChars": allChars, "allAuthors": allAuthors});       
                    });          
                });          
            });    
        });    
    });    
});     

// Route to remove the Book - Author M:M Relationship
app.delete('/delete_book_author', function(req, res) {

    // Get the data
    let data = req.body;

    query1 = `DELETE FROM BooksAuthors WHERE bookId = '${data.bookId}' AND authorId = '${data.authorId}'`;
    db.pool.query(query1, function(error, rows) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    });
});

// Route to remove the Book - Character M:M Relationship
app.delete('/delete_book_char', function(req, res) {

    // Get the data
    let data = req.body;

    query1 = `DELETE FROM BooksCharacters WHERE bookId = '${data.bookId}' AND characterId = '${data.characterId}'`;
    db.pool.query(query1, function(error, rows) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    });
});

// Add author to book
app.post('/add_book_author', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // // Capture NULL values
    // for (var cur_data in data) {
    //   if (isNaN(parseInt(data[cur_data]))) {
    //     data[cur_data] = "NULL";
    //   }
    // }

    // Create the query and run it on the database
    let query1 = `INSERT INTO BooksAuthors (bookId, authorId) VALUES ('${data.bookId}', '${data.authorId}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
          let query2 = `SELECT * FROM BooksAuthors WHERE bookId = '${data.bookId}'`;
          db.pool.query(query2, function(error, rows, fields){

            if (error) {
              console.log(error);
              res.sendStatus(400);
            }
            else {
              res.send(rows);
            }

          })
        }
    })
});


// Add author to book
app.post('/add_book_character', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // // Capture NULL values
    // for (var cur_data in data) {
    //   if (isNaN(parseInt(data[cur_data]))) {
    //     data[cur_data] = "NULL";
    //   }
    // }

    // Create the query and run it on the database
    let query1 = `INSERT INTO BooksCharacters (bookId, characterId) VALUES ('${data.bookId}', '${data.characterId}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
          let query2 = `SELECT * FROM BooksCharacters WHERE bookId = '${data.bookId}'`;
          db.pool.query(query2, function(error, rows, fields){

            if (error) {
              console.log(error);
              res.sendStatus(400);
            }
            else {
              // Send the page to reload
              res.send('/managebooks?bookId=' + data.bookId)
              //res.send(rows);
            }

          })
        }
    })
});

///////////////////////////////
// Display Characters Page
///////////////////////////////

app.get('/characters', function(req, res)
{
    /*
    let query1 = `SELECT * FROM Characters;`;
    db.pool.query(query1, function(error, rows, fields){
        res.render('characters', {data: rows, "title": "The Wheel of Time Database: Characters"});
    })
    */
    let query1 = `SELECT * FROM Characters;`;
    let query2 = `SELECT * FROM Books;`;
    let query3 = `SELECT * FROM Nations;`;

    db.pool.query(query1, function(error, rows, fields){
        let characters = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let books = rows;
            db.pool.query(query3, (error, rows, fields) => {
                let nations = rows;
                return res.render('characters', {dataC: characters, dataB: books, nations: nations, "title": "The Wheel of Time Database: Characters"});
            })
        })
    })             
});     

app.post('/add-character-ajax', function(req, res)
{
    let data = req.body;

    //need to modify to have empty fields submit as 'NULL'
    /*
    let capital = parseInt(data.capital);
    if (isNaN(capital))
    {
        capital = 'NULL'
    }
    */

    query1 = `INSERT INTO Characters (fName, mName, lName, suffix, gender, firstAppeared, nationality) VALUES 
        ('${data.fName}', '${data.mName}', '${data.lName}', '${data.suffix}', '${data.gender}', '${data.firstAppeared}', '${data.nationality}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Characters;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/search-character-ajax', function (req, res){
    let data = req.body;
    let characterId = parseInt(data.id);
    let selectCharacter = `SELECT Books.title as title FROM Books INNER JOIN BooksCharacters ON Books.bookId = BooksCharacters.bookId WHERE BooksCharacters.characterId = ?`;

        db.pool.query(selectCharacter, [characterId], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.send(rows);
            }
        })
});

app.delete('/delete-character-ajax', function (req, res, next){
    let data = req.body;
    let characterId = parseInt(data.id);
    let deleteCharacter = `DELETE FROM Characters WHERE characterId = ?`;

        db.pool.query(deleteCharacter, [characterId], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            res.sendStatus(204);
        }
    })
});

app.put('/put-character-ajax', function(req, res, next){
    let data = req.body;

    let nationality = parseInt(data.nationality);
    // Set to null if we couldn't parse a number
    if (isNaN(nationality)) {
        nationality = null;
    }    

    let character = parseInt(data.name);

    let queryUpdateNationality = `UPDATE Characters SET nationality = ? WHERE Characters.characterId = ?`;
    let selectNation = `SELECT * FROM Nations WHERE nationId = ?`;

    db.pool.query(queryUpdateNationality, [nationality, character], function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            db.pool.query(selectNation, [nationality], function(error, rows, fields){
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
}) 

///////////////////////////////
// Display Nations Page
///////////////////////////////

app.get('/nations', function(req, res)
{
    //res.render('nations', {"title": "The Wheel of Time Database: Nations"});  
    let query1 = `SELECT * FROM Nations;`;
    db.pool.query(query1, function(error, rows, fields){
        res.render('nations', {data: rows, "title": "The Wheel of Time Database: Nations"});
    })                 
});

app.post('/add-nation-ajax', function(req, res)
{
    let data = req.body;

    //need to modify to have empty fields submit as 'NULL'
    /*
    let capital = parseInt(data.capital);
    if (isNaN(capital))
    {
        capital = 'NULL'
    }
    */

    query1 = `INSERT INTO Nations (name, demonym, region, capital, sigil) VALUES ('${data.name}', '${data.demonym}', '${data.region}', '${data.capital}', '${data.sigil}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Nations;`;
            db.pool.query(query2, function(error, rows, fields){
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-nation-ajax', function(req, res, next){
    let data = req.body;
    let nationId = parseInt(data.id);
    let deleteNation = `DELETE FROM Nations WHERE nationId = ?`;

    db.pool.query(deleteNation, [nationId], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            res.sendStatus(204);
        }
    })
});     

// Start listening
app.listen(PORT, function(){
    console.log("Start express on " + PORT + '; press Ctrl-C to terminate.')
});
