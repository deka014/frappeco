var express   = require("express"),
app 		  = express(),
bodyParser    = require("body-parser"), //used in posts
mongoose 	  = require("mongoose"),
flash 		  = require("connect-flash"),
passport 	  = require("passport"),
LocalStrategy = require("passport-local"),
methodOverride= require("method-override"),
//data base 
// Food	 	  	  = require("./models/food"),
// Comment 	  	  = require("./models/comment"),
User 		  = require("./models/user"),
//requiring routes
commentRoutes	 = require("./routes/comment"),
foodRoutes	 	 = require("./routes/food"),
indexRoutes 	 = require("./routes/index");

mongoose.set("useUnifiedTopology", true); 
// console.log(process.env.DATABASEURL)  in terminal DATABASEURL=mongodb://localhost/yelp_camp
// var url = process.env.DATABASEURL || "mongodb://localhost/food_blog"
mongoose.connect("mongodb://localhost/fblog",{ useNewUrlParser: true });
// mongoose.connect("mongodb+srv://deepjyotideka:hello@123@yelpcamp-zfidh.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine" , "ejs");
app.use(express.static(__dirname+"/public"));  //dir name is yelp camp
app.use(methodOverride("_method"));
app.use(flash());

//passsport configuration
app.use(require("express-session")({
	secret  			: "youtube vs tiktok",
	resave				: false,
	saveUninitialized 	: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//user.authenticate is from passport package
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;// now  i dont need to {add currentUser : req.user} in every step
	res.locals.error = req.flash("error");
	res.locals.message = req.flash("success");
	res.locals.navclass = "default";
	next();
});

//reqquires from the route folder
app.use(indexRoutes);
app.use(foodRoutes);  ///campgrounds means all the routes will be starting from campgrounds/xyz
app.use("/:id/comments",commentRoutes);


app.listen(process.env.PORT || 3000, function() {
    console.log("Server started");
  }); 
	