var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
	username:String,
	password:String,
	email : String,
	avatar: {type: String, default: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80"},
	profileCover : {type: String, default: "https://images.unsplash.com/photo-1592898741922-5dd6de5f698c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=749&q=80"}
});



UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);

