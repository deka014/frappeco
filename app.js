var express   = require("express"),
app 		  = express(),
bodyParser    = require("body-parser"), //used in posts
mongoose 	  = require("mongoose"),
flash 		  = require("connect-flash"),
passport 	  = require("passport"),
LocalStrategy = require("passport-local"),
methodOverride= require("method-override"),
faker =  require("faker"),
session = require("express-session"),
//data base 
// Food	 	  	  = require("./models/food"),
// Comment 	  	  = require("./models/comment"),
User 		  = require("./models/user"),
//requiring routes
commentRoutes	 = require("./routes/comment"),
foodRoutes	 	 = require("./routes/food"),
indexRoutes 	 = require("./routes/index");

const MongoStore = require('connect-mongo')(session);

mongoose.set("useUnifiedTopology", true); 
// console.log(process.env.DATABASEURL)  in terminal- export DATABASEURL=mongodb://localhost/yelp_camp
// var url = process.env.DATABASEURL || "mongodb://localhost/food_blog"
// mongoose.connect("mongodb://localhost/fblog",{ useNewUrlParser: true });
mongoose.connect("mongodb+srv://rondeka:hello@123@frappeco.k1hqv.mongodb.net/frappeco?retryWrites=true&w=majority", {useCreateIndex: true,useNewUrlParser: true });

//  async function seedPosts() {
//  	await Food.remove({});
//  	for(const i of new Array(30)) {
//  			const post = {		
//  				title: faker.lorem.word(),
// 				image1: faker.image.image(),
// 				category: 'travel',
//  				description: faker.lorem.text(),
//  				author: {
//  			    '_id' : '5bb27cd1f986d278582aa58c',
//  			    'username' : 'ron'
//  				}
//  			}
//  			await Food.create(post);
//  	}
//  	console.log('40 new posts created');
//  }

// seedPosts();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine" , "ejs");
app.use(express.static(__dirname+"/public"));  //dir name is yelp camp
app.use(methodOverride("_method"));
app.use(flash());

//passsport configuration
app.use(session({
	secret  			: "youtube vs tiktok",
	// resave				: false,
	// saveUninitialized 	: false
		cookie: { maxAge : 60000 * 60 * 24 * 7  },     //in milliseconds.
        resave: false,                  //Don't save the session to store if it hasn't changed
        rolling: true,                  //Reset the cookie Max-Age on every request
        saveUninitialized: false,       //Don't create a session for anonymous users
        secret: "youtube vs tiktok",
        store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));//user.authenticate is from passport package
passport.use(new LocalStrategy ({
  usernameField: 'email',
  usernameQueryFields: ['email']
},User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;// now  i dont need to {add currentUser : req.user} in every step
	res.locals.error = req.flash("error");
	res.locals.message = req.flash("success");
	res.locals.title = "Frappeco - Never go empty", 
	res.locals.meta = {description: "Frappeco is a platform to everyone, starting from gourmets and connoisseur to bibliophiles to share their relishing memories of food.", robot : "index, follow, max-snippet:-1, max-image-preview:large "};
	res.locals.paginatedUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + "?"
	next();
});

//reqquires from the route folder
app.use(indexRoutes);
app.use(foodRoutes);  ///campgrounds means all the routes will be starting from campgrounds/xyz
app.use("/:id/:id1/comments",commentRoutes);


app.listen(process.env.PORT || 5000, function() {
    console.log("Server started");
  }); 
	