var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET home page. */ 
router.get('/', ctrlMain.index);
router.get('/register', ctrlMain.register);
router.get('/login', ctrlMain.login);
router.get('/account', ctrlMain.account);

module.exports = router;