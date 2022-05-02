
CREATE TABLE posts (
	postsID SERIAL PRIMARY KEY,
	 -- userID INT NOT NULL,
	title varchar(255) NOT NULL,
	body varchar(255) NOT NULL
);

CREATE TABLE users (
	userID SERIAL PRIMARY KEY,
	username text NOT NULL,
	password text NOT NULL
);

INSERT INTO posts (userID, title, body) 
VALUES
(1, 'Hello World!', 'This is my code test.'),
(2, 'From Phillip', 'Phillip, my glass with some more root beer.'),
(3, 'Never Gonna Give You Up', 'Never gonna let you down.'),
(4, 'I Hate Menards Command Line', 'Lorem Ipsum.');

INSERT INTO users (username, password) 
VALUES
('janderson390', 'password'),
('pillihP', 'drowssap'),
('UpYouGiveGonnaNever', 'admin123'),
('IHateCommandLines', 'stringbeanchicken');