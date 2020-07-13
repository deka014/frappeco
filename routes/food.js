var express = require("express"),
	router = express.Router(),
	Food = require("../models/food");
	// middleware = require("../middleware/index"); 
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
  cloud_name: 'ddekacloud', 
  api_key: 796252967861617, 
  api_secret: "jzeqZUVUUNU4feMUsBk4CJl4Ya0"
});	
	


router.get("/",function(req,res){
	if (req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search),"gi");
		Food.find({title : regex} ,function(err,searchFood){
			if(err || !searchFood.length){
                req.flash('error', 'No Food matched your search. Please try again.');
                res.redirect("back");
			}else{
				res.render("search",{searchFood : searchFood})
			}
		})
	}else
	// req.user    //contains all the information about logged in user
	Food.find({},function(err,allFood){
		if(err){
			console.log(err);
			} else{
				    res.locals.navclass = "home-nav-color";
				    res.render("food/index",{food: allFood, currentUser : req.user});  //allCampground is accesing the database 
                  }
	})
    
})

router.get("/new",function(req,res){
    res.render("food/new"); 
})

//ajax upload
router.post("/save",upload.single('file'),function(req,res){
	
	console.log(req.file.path);
	cloudinary.uploader.upload(req.file.path, function(result) {
	res.send(result.secure_url)
})
})

router.post("/",function(req,res){ //here the campgrounds is accesed from form ACTION  with post method 
	var title = req.body.title;
	var image1 = req.body.image1;
	var image2 = req.body.image2;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newFood = {title: title , image1: image1, image2: image2 , description: desc, author:author}
	// campgrounds.push(newCampground);
	Food.create(newFood,function(err,newlyCreated){
		if(err){
			console.log(err)
		}else {
			res.redirect("/");
		}
	});
})

// router.get("/search",function(req,res){
// 	var searched = req.query.search
// 	console.log('/'+searched+'/' )
// 	Food.find({title : '/'+searched+'/' } ,function(err,searchFood){
// 		console.log(searchFood)
// 		res.render("search",{searchFood : searchFood})
// 	})
// })

router.get("/:id",function(req,res){
	Food.findById(req.params.id).populate("comments").exec(function(err,foundfood){
		if(err || !foundfood){
			req.flash("error","Food Not Found");
			res.redirect("/")
		} else{
			console.log(foundfood)
			res.render("food/show",{food: foundfood});
		}
		
	})
})


// edit food
router.get("/:id/edit",function(req,res){
	//is user logged in
			Food.findById(req.params.id,function(err,foundfood){
			res.render("food/edit",{food: foundfood})
			
	});
});


//update food
router.put("/:id",function(req,res){
	//find and update the correct campground
	Food.findByIdAndUpdate(req.params.id,req.body.food,function(err, updatedfood){
		if(err){
			console.log(err);
		}else {
			res.redirect("/" + req.params.id ) //or updatedfood._id = req.params.id  both gives the id
		}
	})
})

//destroy food 

router.delete("/:id",function(req,res){
			Food.findByIdAndRemove(req.params.id,function(err){
				if(err){
					res.redirect("/");
				}else{
					res.redirect("/");
				}
			})
			  
			  })





//middleware

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;