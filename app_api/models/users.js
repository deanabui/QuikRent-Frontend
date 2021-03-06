var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var searchSchema = new mongoose.Schema({
    craigslist_housing_section: {type:String,required:true},
    craigslist_site: {type:String,required:true},
    areas: String,
    min_price: {type:Number,required:true},
    max_price: {type:Number,required:true},
    bed: {type:Number,required:true},
    bath: {type:Number,required:true},
    max_transit_distance: {type:Number},
    slack_token: {type:String,unique: true,required:true}
});


var userSchema = new mongoose.Schema({
  name: {type: String,required: true},
 email: {type: String,unique: true,required: true},
 hash: String,
 salt: String,
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
 var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'DSA-SHA1').toString('hex');
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

//building a model of the search schema
mongoose.model('User', userSchema, 'user');

