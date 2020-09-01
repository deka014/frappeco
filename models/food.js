var mongoose = require("mongoose"),
	mongoosePaginateV2 = require("mongoose-paginate-v2");

var foodSchema = new mongoose.Schema({
	title: String,
	image: String,
	category: String,
	imageId : String,
	tagOutput : String,
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

foodSchema.plugin(mongoosePaginateV2);

module.exports = mongoose.model("Food",foodSchema);