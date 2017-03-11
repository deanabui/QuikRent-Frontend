var express = require('express');
var searchRouter = express.Router();
var ctrlSearches = require('../controllers/searches');

/*
assuming all users will only have one search at a given time
*/

searchRouter.get('/:userid', ctrlSearches.getSearch);
searchRouter.post('/:userid/newsearch', ctrlSearches.newSearch);
searchRouter.put('/:userid/:searchid', ctrlSearches.updateSearch);
searchRouter.delete('/:userid/:searchid',ctrlSearches.deleteSearch);

module.exports = searchRouter;
//module.exports = router; //to export routes