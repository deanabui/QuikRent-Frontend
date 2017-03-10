var express = require('express');
var searchRouter = express.Router();
var ctrlSearches = require('../controllers/searches');

/*
assuming all users will only have one search at a given time
*/


//to create a new search
//router.post('/users/:userid/searches', ctrlSearches.createSearch);

//to get a search
searchRouter.get('/:userid/searches', ctrlSearches.getSearch);

//to update a search
//router.put('/users/:userid/searches', ctrlSearches.updateSearch);

//to delete a search
//router.delete('/users/:userid/searches', ctrlSearches.deleteSearch);

module.exports = searchRouter;
//module.exports = router; //to export routes