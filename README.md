Node Authentication with Passport

About Project

This simple web application allows the user to register and sign in and only once they have being authenticated can land on the profile page.

This app is built on express.js while using express-session and passport with a local strategy to take care of authentication

Other Information

I used a MySQL Database to store the user data 

MySQL Structure	-	{

	CREATE DATABASE login;

	USE login;

	CREATE TABLE users(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(30) NOT NULL,
	email varchar(30) NOT NULL,
	password BINARY(60) NOT_NULL,
	PRIMARY KEY(id)
	);
}

I used the bcrypt package to hash the passwords
