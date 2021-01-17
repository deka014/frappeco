var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/user");
	

// router.get("/",function(req,res){
//     res.render("")
// })

//auth routes
router.get("/register",function(req,res){
	res.locals.title = " Sign Up - Frappeco"
	res.locals.meta.description =  "Sign-up and earn by adding content. FraPpeco is a food blog by young and ambitious food enthusiast from Guwahati, serving their unique taste. +91-9613497523 frappecoa@gmail.com"
	res.render("register")
})
//handle sign up 
router.post("/register",function(req,res){
	if (req.body.invite == "ron123"){
	var newUser = new User({
		username :req.body.username, 
		email : req.body.email
	})
	
	User.register(newUser,req.body.password,function(err,user){                          //user.register is a passport command
		if(err){
      return res.render("register", {"error": err.message});  //new way when res.render exist not res.redirect
    }
		passport.authenticate("local")(req,res,function(){
		req.flash("success", "Welcome To Frappeco " + user.username)
        res.redirect("/");
		})
	})
	}else{
		res.redirect("/register")
	}
})
//login form

router.get("/login",function(req,res){
	res.locals.title = "Log In - Frappeco"
	res.locals.meta.description =  "Login. Email. Password. Login. or Sign-Up to add your content in frappeco "
	res.render("login")
	// res.render("login", {message: req.flash("error")})
})
//handel login logic
router.post("/login",passport.authenticate("local",  //middle ware is used 
			{
	           successRedirect:"/",
               failureRedirect:"/login",
				failureFlash: true
             }),function(req,res){
});

//logout route 
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out");
	res.locals.meta = {description: "Logout" , robot : "noindex, follow"}
	res.redirect("/");
})

//profile 

// router.get("/profile/:id",function(req,res){
// 	User.findById(req.params.id,function(err,foundUser){
// 			if(err || !foundUser){
// 			req.flash("error","No Profile Found");
// 			res.redirect("/")
// 		}
// 		else{
// 		  	res.render("profile",{foundUser: foundUser})
// 		}
// 	})
		
// })
router.get("/team",function(req,res){
	res.locals.title = "Our Team - Frappeco"
	res.locals.meta.description = "Frappe is a team of makers, tinkerers, helpers, explorers.We are young and ambitious food enthusiast from Guwahati, serving their unique taste. +91-9613497523 frappecoa@gmail.com"
	res.render("team.ejs")
})

router.get("/privacy",function(req,res){
	res.locals.title = "Privacy Policy - Frappeco"
	res.locals.meta.description =  "PRIVACY POLICY. Effective date: 2020-09-05. 1. Introduction. Welcome to Frappeco. Frappeco operates frappeco.com hereinafter referred to as “Service"
	res.render("privacypolicy")
})

router.get("/terms",function(req,res){
	res.locals.title = "Terms & Conditions - Frappeco"
	res.locals.meta.description = "These Terms of Service govern your use of our website located at frappeco.com (together or individually “Service”) operated by frappeco"
	res.render("tandC")
})

module.exports = router;