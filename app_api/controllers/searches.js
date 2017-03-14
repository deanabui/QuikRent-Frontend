var mongoose = require('mongoose');
var Usr = mongoose.model('User');

//helper function
var sendJsonResponse = function(res,status,content){
  res.status(status);
  res.json(content);
};

//helper function
var doAddSearch = function(req,res,user){
    if(!user){
        sendJsonResponse(res,404,{"message":"userid not found"});
    }else{
        user.searches.push({
            minPrice : req.body.minPrice,
            maxPrice: req.body.maxPrice,
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms
        });
        user.save(function(err,user){
            var thisSerch;
            if(err){
                sendJsonResponse(res,400,err);
            }else{
                thisSearch = user.searches;
                sendJsonResponse(res,201,thisSearch);
            }
        })
    }
}

//get -- R
module.exports.getSearch = function(req,res){ 
    //sendJsonResponse(res,200, {"status": "success"});
    
  Usr  
    .findById(req.params.userid)
    .select('searches')
    .exec(function (err, user){
        var search;
        search = user.searches;
        sendJsonResponse(res,200,search);
  });
};

//post -- C
module.exports.newSearch = function(req,res){
   var userid = req.params.userid;
    if(userid){
        Usr
            .findById(userid)
            .select('searches')
            .exec(function(err,user){
                if(err){
                    sendJsonResponse(res,400,err);
                }else{
                    doAddSearch(req,res,user);
                }
        });
    }else{
        sendJsonResponse(res,404, {"message": "Not found, userid required"});
    }
};

//put -- U
module.exports.updateSearch = function(req,res){
    if(!req.params.userid || !req.params.searchid){
        sendJsonResponse(res,404,{"message":"Not found, userid and searchid are both required."});
        return;
    }
    Usr
        .findById(req.params.userid)
        .select('searches')
        .exec(function(err,user){
            var thisSearch;
            if(!user){
                sendJsonResponse(res,404,{"message":"userid not found"});
                return;
            }else if(err){
                sendJsonResponse(res,400,err);
                return;
            }
        if(user.searches && user.searches.length > 0){
            thisSearch = user.searches.id(req.params.searchid);
            if(!thisSearch){
                sendJsonResponse(res,404, {"message":"searchid not found"});
            }else{
                thisSearch.minPrice = req.body.minPrice;
                thisSearch.maxPrice = req.body.maxPrice;
                thisSearch.bedrooms = req.body.bedrooms;
                thisSearch.bathrooms = req.body.bathrooms;
                user.save(function(err,user){
                    if(err){
                        sendJsonResponse(res,404,err);
                    }else{
                        sendJsonResponse(res,200,thisSearch);
                    }
                });
            }
        }else{
            sendJsonResponse(res,404, {"message":"No search to update"});
        }
    });
};

//delete -- Ds
module.exports.deleteSearch = function(req,res){
    if(!req.params.userid || !req.params.searchid){
        sendJsonResponse(res,404,{"message":"Not found, userid and searchid are both required."});
        return;
    }
    Usr
        .findById(req.params.userid)
        .select('searches')
        .exec(function(err,user){
            if(!user){
                sendJsonResponse(res,404,{"message":"userid not found."});
                return;
            }
        if(user.searches && user.searches.length > 0){
            if(!user.searches.id(req.params.searchid)){
                sendJsonResponse(res,404,{"Message": "searchid not found"});
            }else{
                user.searches.id(req.params.searchid).remove();
                user.save(function(err){
                    if(err){
                        sendJsonReponse(res,404,err);
                    }else{
                        sendJsonResponse(res,204,null);
                    }
                });
            }
        }else{
            sendJsonResponse(res,404,{"message":"No searches to delete"});
        }
    });
};