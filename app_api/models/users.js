var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    name: {
        type: String, 
        unique: false, 
        required: true
    },
    email:{
        type: String,
        unique: true, 
        required: true
    },
    slack_token:{
        type: String, 
        unique: true, 
        required: false
    },
    hash: String, 
    salt: String
});


//this function is creating the salt and hash for the password
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

//this function is running the hash again, and then checking if the 2 hashes are equals
//if they are, we know this is the correct password for the user
userSchema.methods.validPassword = function(password){
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash; 
};

userSchema.methods.generateJwt = function(){
    var expiry = new Date(); 
    expiry.setDate(expiry.getDate() + 7 );
    
    return jwt.sign({
        _id: this._id, 
        email: this.email, 
        username: this. username, 
        exp: parseInt(expiry.getTime()/10000),
    }, process.env.JWT_SECRET);
};

