var express = require('express');
var indexRouter = express.Router();
//var ctrlSearches = require('../controllers/searches');

indexRouter.use('/users', require('./searches'));

//router.get('/users/:userid/searches', ctrlSearches.getSearch);
module.exports = indexRouter;