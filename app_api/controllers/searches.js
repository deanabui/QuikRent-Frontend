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
        console.log("no user");
        sendJsonResponse(res,404,{"message":"userid not found"});
    }else{
        console.log("attempting to push search");
        user.searches.push({
            craigslist_housing_section: req.body.craigslist_housing_section,
            craigslist_site: req.body.craigslist_site,
            areas: req.body.areas,
            min_price: req.body.min_price,
            max_price: req.body.max_price,
            bed: req.body.bed,
            bath: req.body.bath,
            slack_token: req.body.slack_token
        });
        console.log("attempting to save");
        user.save(function(err,user){
            var thisSerch;
            if(err){
                console.log(err);
                sendJsonResponse(res,400,err);
            }else{
                console.log("no error in save");
                thisSearch = user.searches;
                sendJsonResponse(res,201,thisSearch);
            }
        });
        axios.post('http://ec2-52-25-39-194.us-west-2.compute.amazonaws.com:8080/create', {
            craigslist_housing_section: req.body.craigslist_housing_section,
            craigslist_site: req.body.craigslist_site,
            areas: req.body.areas,
            min_price: req.body.min_price,
            max_price: req.body.max_price,
            bed: req.body.bed,
            bath: req.body.bath,
            slack_token: req.body.slack_token,
            max_transit_distance: "",
            neighborhoods: [""],
            transit_stations: {},
            boxes:{},
            
        }, {headers:{
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }}).then(function(res){
            console.log("Slack bot created!");
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
    console.log("made it to newSearch in controller");
    if(userid){
        console.log("user id exsists");
        Usr
            .findById(userid)
            .select('searches')
            .exec(function(err,user){
                if(err){
                    sendJsonResponse(res,400,err);
                    console.log(err);
                }else{
                    console.log("trying doAddSearch");
                    doAddSearch(req,res,user);
                }
        });
        console.log("at end of newSearch");
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
            slack_token: "xoxp-162614409749-161848202177-162467596899-d6b19daad51d3c8c0a666497e048e86c"
        }
                }).then(function(res){
            console.log("Slack bot deleted")
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