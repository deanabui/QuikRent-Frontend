//gives controller access to the database connection
var mongoose = require('mongoose');
//bringing in the Search model so we can interact with the Searches collection
var srch = mongoose.model('user');


//relates to get method
module.exports.searchesList = function(req,res){
    sendJsonResponse(res, 200, {"status" : "success"});
};

//post method
module.exports.searchesCreate = function(req,res){
    
};
//put method
module.exports.searchesReadOne = function(req,res){
    if(req.params && req.params.searchid){
        srch
            .findById(req.params.searchid)
            .exec(function(err, location){
              if(!search){
                  sendJsonResponse(res, 404, {
                      "message": "searchid not found"
                  });
                  return;
              }else if (err){
                  sendJsonResponse(res, 404, err);
                  return;
              }
            sendJsonResponse(res, 200, search);
        });
    }else{
        sendJsonResponse(res, 404, {
            "message": "No searchid in request"
        });
    }
};

module.exports.searchesUpdateOne = function(req,res){
    
};

module.exports.searchesDeleteOne = function(req,res){
    
};

//function to return a json file and response status
var sendJsonResponse = function(res, status, content){
  res.status(status);
  res.json(content);
};