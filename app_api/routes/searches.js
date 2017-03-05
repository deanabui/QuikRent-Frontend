var express = require('express');
var router = express.Router();
var ctrlSearches = require('../controllers/searches');

//get the search w/ params
router.get('/searches', ctrlSearches.searchesList);
//to create a search
router.post('/searches', ctrlSearches.searchesCreate);
//to find a specific search
router.get('/searches/:searchid', ctrlSearches.searchesReadOne); //i don't think we'll need this if we only allow users to have one search, but it's good to have
//to update a search
router.put('/searches/:searchid', ctrlSearches.searchesUpdateOne);
//to delete a search
router.delete('/searches/:searchid', ctrlSearches.searchesDeleteOne);

module.exports = router; //to export routes