var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/user");
	

// router.get("/",function(req,res){
//     res.render("")
// })

//auth routes
router.get("/register",function(req,res){
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
		req.flash("success", "Welcome To Guwahati Food Blog" + user.username)
        res.redirect("/");
		})
	})
	}else{
		res.redirect("/register")
	}
})
//login form

router.get("/login",function(req,res){
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

router.get("/privacyandpolicy",function(req,res){
	res.render("privacypolicy")
})

router.get("/tandc",function(req,res){
	res.render("tandC")
})

module.exports = router;