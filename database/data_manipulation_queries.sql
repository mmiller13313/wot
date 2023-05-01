-- CS 340
-- Group 94
--  Dominique Lazaros 
--  Mark Miller 
--  John Cheshire

-- Backend variables denoted by :variableName


-- BOOK PAGE

-- Initialize the data when you navigate to the Books page
SELECT * FROM Books

-- Add a Book to the Books table and get all books
INSERT INTO Books (title, pubDate, length, bookNumber) 
VALUES (:titleInput, :pubDateInput, :lengthInput, :bookNumberInput)
SELECT * FROM Books

-- Associate an Author from a Book (M-to-M relationship addition)
INSERT INTO BooksAuthors (bookId, authorId)
VALUES (bookIdFromForm, authorIdFromDropdownInput)

-- Associate a Character from a Book (M-to-M relationship addition)
INSERT INTO BooksCharacters (bookId, characterId)
VALUES (bookIdFromForm, characterIdFromDropdownInput)

-- Remove an Author association from a Book (M-to-M relationship deletion)
DELETE FROM BooksAuthors 
WHERE bookId = :bookIdSelectedFromBookList AND authorId = :authorIdSelectedFromAuthorList

-- Remove a Character association from a Book (M-to-M relationship deletion)
DELETE FROM BooksCharacters 
WHERE bookId = :bookIdSelectedFromBookList AND characterId = :characterIdSelectedFromAuthorList


-- AUTHORS PAGE

-- Initialize the data when you navigate to the Authors page 
SELECT authorId, fName, mName, lName, suffix, penName, birth, DATE_FORMAT(death, '%m-%d-%Y') as death FROM Authors;

-- Add an Author to the Authors table and get all Authors
INSERT INTO Authors (fName, mName, lName, suffix, penName, birth, death) 
VALUES (:fNameInput, :mNameInput or NULL, :lNameInput, :suffixInput or NULL, :penNameInput, :birthInput, :deathInput or NULL)
SELECT * FROM Authors

-- Delete an Author from the Authors table 
DELETE FROM Authors 
WHERE authorId = :deleteEntry


-- CHARACTERS PAGE

-- Initialize the data when you navigate to the Characters page 
SELECT * FROM Characters
SELECT * FROM Books
SELECT * FROM Nations

-- Select a Character from the drop down menu to see all books in which the Character makes an appearance
SELECT Books.title as title FROM Books INNER JOIN BooksCharacters ON Books.bookId = BooksCharacters.bookId WHERE BooksCharacters.characterId = :characterId

-- Add a Character to the Characters table and return all characters
INSERT INTO Characters (fName, mName, lName, suffix, gender, firstAppeared, nationality)
VALUES (:fNameInput, :mNameInput or NULL, :lNameInput or NULL, :suffixInput or NULL, :genderInput, :firstAppearedInput, :nationalityInput or NULL)
SELECT * FROM Characters

-- Update a Character in the Characters table 
Update Characters
SET firstAppeared = :firstAppearedInput
WHERE characterId = :characterId: from update form

-- Delete a Character from the Characters table 
DELETE from Characters
WHERE characterId = :deleteEntry

-- Update charcters
UPDATE Characters SET nationality = :nationId WHERE Characters.characterId = :characterId
SELECT * FROM Nations WHERE nationId = :nationId


-- NATIONS PAGE

-- Initialize the data when you navigate to the Nations page 
SELECT * FROM Nations

-- Add a Nation to the Nations table and get all Nations
INSERT INTO Nations (name, demonym, region, capital, sigil)
VALUES (:nameInput, :demonymInput, :regionInput, :capitalInput or NULL, :sigilInput or NULL)
SELECT * FROM Nations

-- Delete a Nation from the Nations table 
DELETE from Nations
WHERE nationId = :deleteEntry



-- MANAGE RELATIONSHIPS PAGE

-- Query to get authors of books 
SELECT Books.title as title, Authors.fname as fname, Authors.lname as lname, Authors.authorId as authorId, Books.bookId as bookId
    FROM Books INNER JOIN BooksAuthors ON Books.bookId = BooksAuthors.bookId 
    INNER JOIN Authors ON Authors.authorId = BooksAuthors.authorId
    WHERE Books.bookId =:bookId

-- Query to get characters in books
SELECT Books.title as title, fname, lname, Characters.characterId as characterId, Books.bookId as bookId
    FROM Books INNER JOIN BooksCharacters ON Books.bookId = BooksCharacters.bookId 
    INNER JOIN Characters ON BooksCharacters.characterId = Characters.characterId
    WHERE Books.bookId = :bookId
    
-- Get book title
SELECT title, bookId FROM Books WHERE bookId = :bookId

-- Get list of characters for drop down menu
SELECT characterId, CONCAT(characterID, " - ", fname, " ", lname) as charDisplay 
                FROM Characters WHERE characterId NOT IN (SELECT characterId FROM BooksCharacters WHERE bookId = :bookId
                                                          
-- Get list of authors for drop down menu
SELECT authorId, CONCAT(authorId, " - ", fname, " ", lname) as authDisplay FROM 
                Authors WHERE authorId NOT IN (SELECT authorId FROM BooksAuthors WHERE bookId = :bookId
                                               
-- remove the Book - Author M:M Relationship.
DELETE FROM BooksAuthors WHERE bookId = :bookId} AND authorId = :authorId

-- remove the Book - Character M:M Relationship
DELETE FROM BooksCharacters WHERE bookId = :bookId AND characterId = :characterId
                                               
-- Add Author to Book
INSERT INTO BooksAuthors (bookId, authorId) VALUES (:data.bookId, :data.authorId)
SELECT * FROM BooksAuthors WHERE bookId = :data.bookId

-- Add Character to Book
INSERT INTO BooksCharacters (bookId, characterId) VALUES (:bookId, :characterId)
SELECT * FROM BooksCharacters WHERE bookId = :bookId                                               
