var mongoose = require('mongoose');
var Usr = mongoose.model('User');

module.exports.getSearch = function(req,res){
    res.status(200);
    res.json({"status": "success"});
};