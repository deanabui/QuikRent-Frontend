var mongoose = require('mongoose');

//defining the searches schema
var searchSchema = new mongoose.Schema({
    //I think we have to do some belongs to type of syntax but I'm not sure
    
    //how to require the userSchema?
    user: [userSchema.schema], //user data so we know who the search belongs to
    minPrice: String,
    maxPrice: String,
    //slackToken: String, //i don't think we need the slacktoken in the search because it should be saved in the userSchema
    bedrooms: String,
    bathrooms: String
    //coords: {type: [Number], index: '2dshere'} for when we allow coordinates
});

//building a model of the search schema
mongoose.model('Search', searchSchema);

