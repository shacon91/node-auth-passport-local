var express = require('express');
var router = express.Router();
var db = require("../config/connect.js");
var passport = require("passport");
//var bcrypt = require("bcrypt");
const { check, body ,validationResult } = require('express-validator/check');
		
router.get('/', function(req, res) {
  	res.render('login');
});

router.post('/', passport.authenticate('local', {
	successRedirect:'/profile',
	failureRedirect:'/login'
}));

module.exports = router;

/*
router.post('/',[

	body("email").isEmail(),
	body("password").isLength({ min: 8 })

	], function(req, res, next) {
	
		var errors = validationResult(req);

		if(!errors.isEmpty()){
			res.render('login', {errors:"Please enter a valid email and password"});
		}else{
			const email = req.body.email,
				  password = req.body.password;

			bcrypt.compare(password, hash, function(err, res) {
				var sql = "SELECT id, name FROM users WHERE email=? AND password=?";
				db.query(sql,[email,password],function(error,row,fields){
					if(error){
						const dbError = "There is an issue with connecting to the database";
						res.render('login', {dbError:dbError});
					}else if(row.length !== 1){
						res.render('login', {errors:"Incorrect Email/Password combination"});
					}else{
			  			res.redirect('profile');
					}
				});
			});

			
		}
});*/

module.exports = router;
