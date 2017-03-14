//gives controller access to the database connection
var mongoose = require('mongoose');
//bringing in the Search model so we can interact with the Searches collection
var Usr = mongoose.model('User');

var sendJsonResponse = function(res,status,content){
  res.status(status);
  res.json(content);
};

//get -- R
module.exports.getUser = function(req,res){ 
    //sendJsonResponse(res,200, {"status": "success"});
    
  Usr  
    .findById(req.params.userid)
    .exec(function (err, user){
        sendJsonResponse(res,200,user);
  });
};

//post -- C
module.exports.createUser = function(req,res){
    console.log(req.body);
    Usr.create({
        name:req.body.name,
        userName: req.body.userName,
        password:req.body.password,
        email_address: req.body.email_address,
        slack_token: req.body.slack_token}, 
    function(err,user){
        if(err){
            console.log(err);
            sendJsonResponse(res,400, err);
        }else{
            console.log(user);
            sendJsonResponse(res, 201, user);
        }
    });
};

//put -- U
module.exports.updateUser = function(req,res){
  if(!req.params.userid){
      sendJsonResponse(res,404, {"message": "Not found. UseriD is required."});
      return;
  }  
  Usr
    .findById(req.params.userid)
    .select('')
    .exec(function(err, user){
        if(!user){
            sendJsonResponse(res, 404, {"message": "userid not found"});
            return;
        }else if(err){
            sendJsonResponse(res, 404, err);
            return;
        }
        user.name = req.body.name;
        user.userName = req.body.userName;
        user.email_address = req.body.email_address;
        user.save(function(err, user){
            if(err){
                sendJsonResponse(res,404,err);
            }else{
                sendJsonResponse(res,200,user);
            }
        });
    });
};

//delete -- D
module.exports.deleteUser = function(req,res){
    var userid = req.params.userid;
    if(userid){
        Usr
            .findById(userid)
            .exec(function(err, user){
            if(err){
                console.log(err);
                sendJsonResponse(res,404,err);
                return;
            }
            console.log("User iD " + userid + "deleted.");
            sendJsonResponse(res, 204, null);
        });
    }else{
        sendJsonResponse(res,404,{"message": "no userid"});
    }
};