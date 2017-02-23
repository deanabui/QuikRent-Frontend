var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require("mongoose");

//not user if User is the right thing
var User = mongoose.model('User');

//to override the default use of username, for email
passport.use(new LocalStrategy(
    { usernameField: 
        'email'
    },
    function(username, password, done){
        User.findOne({email: username}, function(err, user){
            if(err){ return done(err);}
            if(!user){
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)){
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        })
    }
));