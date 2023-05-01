DROP TABLE IF EXISTS `BooksCharacters`;
DROP TABLE IF EXISTS `BooksAuthors`;
DROP TABLE IF EXISTS `Characters`;
DROP TABLE IF EXISTS `Nations`;
DROP TABLE IF EXISTS `Authors`;
DROP TABLE IF EXISTS `Books`;

CREATE TABLE `Books` (
  `bookId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `pubDate` date NOT NULL,
  `length` int NOT NULL,
  `bookNumber` int NOT NULL,
  PRIMARY KEY (bookId)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

CREATE TABLE `Authors` (
  `authorId` int NOT NULL AUTO_INCREMENT,
  `fName` varchar(20) NOT NULL,
  `mName` varchar(20),
  `lName` varchar(20) NOT NULL,
  `suffix` varchar(5),
  `penName` varchar(50),
  `birth` date NOT NULL,
  `death` date,
  PRIMARY KEY (authorId)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

CREATE TABLE `Nations` (
  `nationId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `demonym` varchar(60) NOT NULL,
  `region` varchar(100) NOT NULL,
  `capital` varchar(20),
  `sigil` varchar(50) NOT NULL,
  PRIMARY KEY (nationId)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

CREATE TABLE `Characters` (
  `characterId` int NOT NULL AUTO_INCREMENT,
  `fName` varchar(20) NOT NULL,
  `mName` varchar(20),
  `lName` varchar(20),
  `suffix` varchar(10),
  `gender` char(1) NOT NULL,
  `firstAppeared` int NOT NULL,
  `nationality` int,
  PRIMARY KEY (characterId),
  FOREIGN KEY (firstAppeared) REFERENCES Books(bookId),
  FOREIGN KEY (nationality) REFERENCES Nations(nationId) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

CREATE TABLE BooksAuthors (
  `bookId` int NOT NULL,
  `authorId` int NOT NULL,
  PRIMARY KEY (bookId, authorId),
  FOREIGN KEY (bookId) REFERENCES Books(BookId)
  ON DELETE CASCADE,
  FOREIGN KEY (authorId) REFERENCES Authors(authorId)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

CREATE TABLE BooksCharacters (
  `bookId` int NOT NULL,
  `characterId` int NOT NULL,
  PRIMARY KEY (bookId, characterId),
  FOREIGN KEY (bookId) 
    REFERENCES Books(BookId)
    ON DELETE CASCADE,
  FOREIGN KEY (characterId) 
    REFERENCES Characters(characterId)
    ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

INSERT INTO Books (title, pubDate, length, bookNumber) VALUES 
  ('The Eye of the World', '1990-01-15', 814, 1),
  ('The Great Hunt', '1990-11-15', 705, 2),
  ('The Dragon Reborn', '1991-09-15', 699, 3),
  ('The Gathering Storm', '2009-10-27', 1120, 12);


INSERT INTO Authors (fName, mName, lName, suffix, penName, birth, death) VALUES
  ('James', 'Oliver', 'Rigney', 'Jr.', 'Robert Jordan', '1948-10-17', '2007-09-16'),
  ('Brandon', NULL, 'Sanderson', NULL, NULL, '1975-12-19', NULL);


INSERT INTO Nations (name, demonym, region, capital, sigil) VALUES
  ('Andor', 'Andoran', 'Central Westlands', 'Caemlyn', 'The White Lion'),
  ('Cairhien', 'Cairhienin', 'Between the River Erinin and Dragonwall, North of Caemlyn and South of Kinslayer''s Dagger', 'Cairhien', 'The Rising Sun'),
  ('Tear', 'Tairen', 'Southeast, East of Illian', 'City of Tear', 'The Crescent Moons');


INSERT INTO Characters (fName, mName, lName, suffix, gender, firstAppeared, nationality) VALUES
  ('Rand', NULL, 'al''Thor', NULL, 'M',
    (SELECT bookId FROM Books WHERE bookNumber = 1),
    (SELECT nationId FROM Nations WHERE demonym = 'Andoran')),
  ('Moiraine', NULL, 'Damodred', NULL, 'F',
    (SELECT bookId FROM Books WHERE bookNumber = 1),
    (SELECT nationId FROM Nations WHERE demonym = 'Cairhienin')),
  ('Juilin', NULL, 'Sandar', NULL, 'M', 
    (SELECT bookId FROM Books WHERE bookNumber = 3),
    (SELECT nationId FROM Nations WHERE demonym = 'Tairen'));

INSERT INTO BooksAuthors (bookId, authorId) VALUES
  ((SELECT bookId FROM Books WHERE bookNumber = 1),
    (SELECT authorId FROM Authors WHERE penName = 'Robert Jordan')),
  ((SELECT bookId FROM Books WHERE bookNumber = 2),
    (SELECT authorId FROM Authors WHERE penName = 'Robert Jordan')),
  ((SELECT bookId FROM Books WHERE bookNumber = 3),
    (SELECT authorId FROM Authors WHERE penName = 'Robert Jordan')),
  ((SELECT bookId FROM Books WHERE bookNumber = 12),
    (SELECT authorId FROM Authors WHERE penName = 'Robert Jordan')),
  ((SELECT bookId FROM Books WHERE bookNumber = 12),
    (SELECT authorId FROM Authors WHERE lName = 'Sanderson'));

INSERT INTO BooksCharacters (bookId, characterId) VALUES
  ((SELECT bookId FROM Books WHERE bookNumber = 1),
    (SELECT characterId FROM Characters WHERE fName = 'Rand')),
  ((SELECT bookId FROM Books WHERE bookNumber = 1),
    (SELECT characterId FROM Characters WHERE fName = 'Moiraine')),
  ((SELECT bookId FROM Books WHERE bookNumber = 2),
    (SELECT characterId FROM Characters WHERE fName = 'Rand')),
  ((SELECT bookId FROM Books WHERE bookNumber = 2),
    (SELECT characterId FROM Characters WHERE fName = 'Moiraine')),
  ((SELECT bookId FROM Books WHERE bookNumber = 3),
    (SELECT characterId FROM Characters WHERE fName = 'Rand')),
  ((SELECT bookId FROM Books WHERE bookNumber = 3),
    (SELECT characterId FROM Characters WHERE fName = 'Moiraine')),
  ((SELECT bookId FROM Books WHERE bookNumber = 3),
    (SELECT characterId FROM Characters WHERE fName = 'Juilin')),
  ((SELECT bookId FROM Books WHERE bookNumber = 12),
    (SELECT characterId FROM Characters WHERE fName = 'Rand'));
