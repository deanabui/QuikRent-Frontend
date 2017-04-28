var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
 res.status(status);
 res.json(content);
};

module.exports.register = function(req, res) {
 if(!req.body.rname || !req.body.remail || !req.body.rpassword) {
     sendJSONresponse(res, 400, {
        "message": "All fields required"
     });
     return;
 }
 var user = new User();
 user.name = req.body.rname;
 user.email = req.body.remail;
 user.setPassword(req.body.rpassword);
 user.save(function(err) {
     var token;
     if (err) {
        sendJSONresponse(res, 404, err);
     } else {
         token = user.generateJwt();
         sendJSONresponse(res, 200, {
         "token" : token
         });
     }
 });
};

module.exports.login = function(req, res) {
     if(!req.body.email || !req.body.password) {
         sendJSONresponse(res, 400, {
         "message": "All fields required"
         });
         return;
     }
     passport.authenticate('local', function(err, user, info){
         var token;
         if (err) {
         sendJSONresponse(res, 404, err);
         return;
         }
         if(user){
         token = user.generateJwt();
         sendJSONresponse(res, 200, {
         "token" : token
         });
         } else {
         sendJSONresponse(res, 401, info);
         }
     })(req, res);
};