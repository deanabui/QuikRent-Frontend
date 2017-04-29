var express = require('express');
var indexRouter = express.Router();

indexRouter.use('/user/search', require('./searches'));
indexRouter.use('/user', require('./users'));

module.exports = indexRouter;