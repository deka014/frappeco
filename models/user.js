var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
	username:String,
	password:String,
	email : String,
	avatar: {type: String, default: "https://thumbs.dreamstime.com/b/avatar-icon-avatar-flat-symbol-isolated-white-avatar-icon-avatar-flat-symbol-isolated-white-background-avatar-simple-icon-124920496.jpg"},
	profileCover : {type: String, default: "https://images.unsplash.com/photo-1592312040834-bb0d621713e1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"}
});



UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);

