var express = require("express"),
    moment = require('moment'),
	router = express.Router(),
	Food = require("../models/food"),
	Comment = require("../models/comment"), 
	middleware = require("../middleware/index"); 
//if the name is index of any file then it takes the index special name 
var multer = require('multer');
var storage = multer.diskStorage({
  	filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  	}
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'frappeco', 
  api_key: 312348958682446, 
  api_secret: "6lbkwgl7wL5wN_GdJ3ymBHfEoR0"
});	
	


router.get("/",async function(req,res){
	if (req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search),"gi");
		let food = await Food.paginate({tagOutput : regex}, {
			page: req.query.page || 1,
			limit: 12,
			sort: '-_id'
		});
		food.page = Number(food.page);
		if (!food.docs.length) {
			req.flash('error', 'No Food matched your search. Please try again.');
            res.redirect("back");;
		}else{
		// const delimiter = req.query.search ? '&' : '?';      not used because there are no multiple query
		var paginatedUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + "&"
		res.render("food/showcase",{topic :"search result for : "+ req.query.search, paginatedUrl , food})	
		}
		
	}
	else{
			try{
				let food = await Food.find({'approach.feature' : true});
				let popular = await Food.find({'approach.popular ' : true});
				let random = Math.floor(Math.random() * 25);
				// console.log(random)
				// res.locals.navclass = "home-nav-color";
				res.render("food/index",{food , random});  //allCampground is accesing the database 
			}
			catch(err){
				req.flash("error",err.message);
				return res.redirect("back");
			}
		
	}
})

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("food/new"); 
})

//ajax upload
router.post("/save",upload.single('file'),function(req,res){
	
	console.log(req.file.path);
	cloudinary.uploader.upload(req.file.path, function(result) {
	res.send(result.secure_url)
})
})

router.post("/",middleware.isLoggedIn,upload.single('image'),function(req,res){ //here the campgrounds is accesed from form ACTION  with post method 
	console.log(req.file)
	cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
		if (err){
			req.flash("error",err.messsage)
		}
    // add cloudinary url for the image to the campground object under image property
	req.body.food.date = moment().format('LL');
	req.body.food.image = result.secure_url;
	//add images public id to campground db 
	req.body.food.imageId = result.public_id;	
	// console.log(result)
 	 // add author to campground
 	req.body.food.author = {
    id: req.user._id,
    username: req.user.username
  	}
	Food.create(req.body.food,function(err,newlyCreated){
		if(err){
			console.log(err)
		}else {
			res.redirect("/" + newlyCreated.id);
		}
	});
})
})

// router.get("/search",function(req,res){
// 	var searched = req.query.search
// 	console.log('/'+searched+'/' )
// 	Food.find({title : '/'+searched+'/' } ,function(err,searchFood){
// 		console.log(searchFood)
// 		res.render("search",{searchFood : searchFood})
// 	})
// })

router.get("/recipes",function(req,res){
	Food.paginate({category : "recipes" }, {
				 		 page: req.query.page || 1,
				  		 limit: 12
					   },function(err,allFood){
			if(err){
			console.log(err);
			} else{
				
			res.render("food/showcase",{food: allFood, topic:"Recipes"});  //allCampground is accesing the database 
                  }
	})
})

router.get("/food-blogs",function(req,res){
		Food.paginate({category : "food blogs" }, {
				 		 page: req.query.page || 1,
				  		 limit: 12
					   },function(err,allFood){
			if(err){
			console.log(err);
			} else{
				
			res.render("food/showcase",{food: allFood, topic:"Food Blogs"});  //allCampground is accesing the database 
                  }
	})
	
})

router.get("/food-facts",function(req,res){
		Food.paginate({category: "food facts"}, {
				 		 page: req.query.page || 1,
				  		 limit: 12,
						 sort: '-_id'	
					   },function(err,allFood){
			if(err){
			console.log(err);
			} else{
				
			res.render("food/showcase",{food: allFood, topic:"Food Facts"});  //allCampground is accesing the database 
                  }
	})
})

router.get("/blogging-tips",function(req,res){
		Food.paginate({category: "blogging tips"}, {
				 		 page: req.query.page || 1,
				  		 limit: 12,
						 sort: '-_id'	
					   },function(err,allFood){
			if(err){
			console.log(err);
			} else{
				
			res.render("food/showcase",{food: allFood, topic:"Blogging Tips"});  //allCampground is accesing the database 
                  }
	})
})

router.get("/food-affairs",function(req,res){
		Food.paginate({category: "food affairs"}, {
				 		 page: req.query.page || 1,
				  		 limit: 12,
						 sort: '-_id'	
					   },function(err,allFood){
			if(err){
			console.log(err);
			} else{
				
			res.render("food/showcase",{food: allFood, topic:"Food Affairs"});  //allCampground is accesing the database 
                  }
	})
})

router.get("/food-stories",function(req,res){
		Food.paginate({category: "food stories"}, {
				 		 page: req.query.page || 1,
				  		 limit: 12,
						 sort: '-_id'	
					   },function(err,allFood){
			if(err){
			console.log(err);
			} else{
				
			res.render("food/showcase",{food: allFood, topic:"Food Stories"});  //allCampground is accesing the database 
                  }
	})
})

router.get("/:id",function(req,res){
	Food.findById(req.params.id).populate("comments").exec(function(err,foundfood){
		if(err || !foundfood){
			// req.flash("error","Food Not Found");
			// res.redirect("/")
			res.render("error")
		} else{
			console.log(foundfood)
			res.render("food/show",{food: foundfood });
		}
		
	})
})


// edit food
router.get("/:id/edit",middleware.checkFoodOwnership,function(req,res){
	//is user logged in
			Food.findById(req.params.id,function(err,foundfood){	
			res.render("food/edit",{food: foundfood })
			
	});
});


//update food
router.put("/:id",middleware.checkFoodOwnership,upload.single("image"),function(req,res){
	Food.findById(req.params.id,async function(err, updatingPost){
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		}else {
			if (req.file){
				try{
					await cloudinary.v2.uploader.destroy(updatingPost.imageId);
					var result = await cloudinary.v2.uploader.upload(req.file.path);
					updatingPost.imageId = result.public_id;
					updatingPost.image = result.secure_url;
				}
				catch(err){
					req.flash("error",err.message);
					return res.redirect("back");
				}
			}
		}
		updatingPost.title = req.body.food.title;
		updatingPost.category = req.body.food.category;
		updatingPost.description = req.body.food.description;
		updatingPost.tagOutput = req.body.food.tagOutput;
		updatingPost.save();
		req.flash("success","Updated Your Post");
		res.redirect("/" + req.params.id ) //or updatedCamp._id = req.params.id  both gives the id
	})
})

//destroy food 

router.delete("/:id",middleware.checkFoodOwnership,function(req,res){
		Food.findById(req.params.id, async function(err, deletingPost){
				if(err){
					req.flash("error", err.message)
					res.redirect("/");
				}else{
					try{
						await cloudinary.v2.uploader.destroy(deletingPost.imageId);
						await Comment.remove({
						_id: { $in : deletingPost.comments }})
						deletingPost.remove();
						req.flash("success","Post deleted ")
						res.redirect("/")
					}
	                  catch(err){
						req.flash("error",err.message);
						return res.redirect("back");
					}
					
				}
				
			})
})





//middleware

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
	