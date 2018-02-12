var express = require("express"),
	router = express.Router(),
	passport = require("passport");

router.get("/", function(req,res){
	req.logout();
	req.session.destroy();
	res.redirect("/");
})

module.exports = router;