var mongoose = require("mongoose")
var foodSchema = new mongoose.Schema({
	title: String,
	image1: String,
	image2: String,
	description: String,
	author : {
		id : {
			type	: mongoose.Schema.Types.ObjectId,
			ref		: "User"
		},
		username: String
	},
	comments : [
	   { type : mongoose.Schema.Types.ObjectId,
	     ref : "Comment"
	   }
	]
});
// var Campground = mongoose.model("Campground",campgroundSchema);
module.exports = mongoose.model("Food",foodSchema);