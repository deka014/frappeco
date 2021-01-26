const mongoose = require("mongoose");

const subscribersSchema = new mongoose.Schema({
	name : String,
	email : String,
	msg : String
})

module.exports = mongoose.model("Subscribers",subscribersSchema)