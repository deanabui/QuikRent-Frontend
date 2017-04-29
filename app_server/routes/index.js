var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET home page. */ 
router.get('/', ctrlMain.index);
router.get('/home', ctrlMain.home);
router.get('/register', ctrlMain.register);
router.get('/login', ctrlMain.login);
router.get('/account', ctrlMain.account);
router.get('/about', ctrlMain.about);
router.get('/faq', ctrlMain.faq);


module.exports = router;