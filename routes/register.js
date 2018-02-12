var express = require("express"),
	router = express.Router(),
	db = require("../config/connect"),
	bcrypt = require("bcrypt"),
	passport = require("passport");
const { check, body ,validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

router.get("/", function(req,res){
	res.render("register");
})

var findUserByEmail = (email) => {
	return new Promise((resolve,reject) => {
		const sql = "SELECT id FROM users WHERE email=?";
		db.query(sql,email,(error,row)=>{
		
			if(error) throw error;
			
			if(row.length ===0){
				resolve(true);
			}else{
				reject(Error("This email is already in use"));
			}
		});
	});
}

var handleRegistration = (req,res) => {
	
	const errors = validationResult(req);

	if(!errors.isEmpty()){
		res.render("register",{errors:errors.mapped()});

	}else{

		const user = matchedData(req);
		delete user.password2;

		const saltRounds = 10;

		bcrypt.hash(user.password, saltRounds, function(error, hash) {

			if (error) throw error;
	  		const sql = "INSERT INTO users SET ?";
	  		user.password = hash;
			db.query(sql,[user],(error,result)=>{
			
				if(error) throw error;
				if(result.affectedRows === 0){
					res.render("register",{errorUser:"Could not create user"});
				}else{
					const sql = "SELECT id FROM users WHERE email=?";
					db.query(sql,user.email,(error,result)=>{
						if(error) throw error;

						req.login(result[0],(error)=>{
							res.redirect('profile');
						});
					});
					
				}
			});
		});

	
	}
};


passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});
 
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

function authenticationMiddleware(){
	return (req,res,next) => {

		console.log(`
				req.session.passport.user: 
				${JSON.stringify(req.session.passport)}
			`);

		if(req.isAuthenticated()) return next();

		res.redirect('/login');
	}
}


router.post("/",[

		body("name")
			.isLength({min:1}).withMessage("Please enter your name.")
			.isAlpha().withMessage("Please enter your correct name")
			.trim(),

		body("email")
			.isLength({min:1}).withMessage("Please enter your email.")
			.isEmail().withMessage("Please enter a correct email address")
			.trim()
			.normalizeEmail()
			.custom((value) => {
				return findUserByEmail(value).then()
			}),


		body("password", "Must be at least 8 characters,\n contain at least one number, \n contain at least one letter")
			.isLength({min:1}).withMessage("Please enter a password.")
			.isLength({min:8, max:50})
			.matches(/^(?=.*[a-z])(?=.*\d).{8,}$/),

		body("password2","Passwords dont match")
			.isLength({min:1}).withMessage("Please re-enter your password.")
			.custom((value,{req}) => value === req.body.password )	


	],handleRegistration);


module.exports = router;