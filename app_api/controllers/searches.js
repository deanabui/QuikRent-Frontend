var mongoose = require('mongoose');
var Usr = mongoose.model('User');
var axios = require('axios');

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
        axios.post('http://ec2-52-25-39-194.us-west-2.compute.amazonaws.com:8080/create', {
            //this is the JSON obj
            minPrice : req.body.minPrice,
            maxPrice: req.body.maxPrice,
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms, 
            slack_token: "xoxp-162614409749-161848202177-162467596899-d6b19daad51d3c8c0a666497e048e86c",
            neighborhoods:
                ["berkeley north", "berkeley", "rockridge"]
        }).then(function(res){
            console.log(res.data)
        }).catch(function(err){
            console.log(err);     
        });
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
                
                //delete a bot
                axios({
                    method: 'delete', 
                    url: 'http://ec2-52-25-39-194.us-west-2.compute.amazonaws.com:8080/delete',
                    data: {
            //this is the JSON obj
            slack_token: "xoxp-136900882994-136257198401-162525310386-197fdd0a4bba834cb4a7f40fde8a4559"
        }
                }).then(function(res){
            console.log(res.data)
        }).catch(function(err){
            console.log(err); 
                });
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