var Food = require("../models/food");
var Comment  = require("../models/comment");
//all middle ware goes here 
var middlewareObj = {};

middlewareObj.checkFoodOwnership = function(req,res,next){
		if(req.isAuthenticated()){
			Food.findOne({category : req.params.id , slug1 : req.params.id1},function(err,foundFood){
		if(err || !foundFood){
			req.flash("error", "Food Not Found")
			res.redirect("/foods")
		}else{
		//does user own the food 
		if (foundFood.author.id.equals(req.user._id) || req.user.isAdmin){
			next();
		}else{
			 req.flash("error", "You Don't Have Permission")
			 res.redirect("back")
		     }
		 }
	})
	} else {
		req.flash("error", "You Need To Be LoggedIn")
		res.redirect("back")  //takes back to previous page 
	}
}
middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err || !foundComment){
			req.flash("error", "Comment Not Found")
			res.redirect("back")
		}else{
		//does user own the food 
		if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
			next();
		}else{
			req.flash("error", "You Need To Be LoggedIn")
			 res.redirect("back")
		     }
		 }
	})
	} else {
		res.redirect("back")  //takes back to previous page 
	}
	
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You Need To Be LoggedIn"); //it doesnt show right now but gives the capability to show in next request
	res.redirect("/login");                   //req.flash(key , value)
} 




module.exports = middlewareObj;

