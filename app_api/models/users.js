var mongoose = require('mongoose');
var crypto = require('crypto');
var pbkdf2 = require('pbkdf2-sha256');
var jwt = require('jsonwebtoken');
//var passportLocalMongoose = require('passport-local-mongoose');
//defining the searches schema
var searchSchema = new mongoose.Schema({
    //I think we have to do some belongs to type of syntax but I'm not sure
    
    //how to require the userSchema?
    //user: [userSchema.schema], //user data so we know who the search belongs to
    minPrice: String,
    maxPrice: String,
    //slackToken: String, //i don't think we need the slacktoken in the search because it should be saved in the userSchema
    bedrooms: String,
    bathrooms: String
    //coords: {type: [Number], index: '2dshere'} for when we allow coordinates
});


var userSchema = new mongoose.Schema({
  name: {
 type: String,
 required: true
 },
 email: {
 type: String,
 unique: true,
 required: true
 },
 hash: String,
 salt: String,
    //the feild searches that will be a sub document connected to the user
  searches: [searchSchema]
    
});

userSchema.methods.setPassword = function(password){
 console.log("made it inside the setPassword func");
 this.salt = crypto.randomBytes(16).toString('hex');
 console.log("salted");
 this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'DSA-SHA1').toString('hex');
 console.log("hashed");
};

userSchema.methods.validPassword = function(password) {
 var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
 return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
 var expiry = new Date();
 expiry.setDate(expiry.getDate() + 7);
 return jwt.sign({
 _id: this._id,
 email: this.email,
 name: this.name,
 exp: parseInt(expiry.getTime() / 1000),
 }, process.env.JWT_SECRET);
};

//userSchema.plugin(passportLocalMongoose);

//building a model of the search schema
mongoose.model('User', userSchema, 'user');

