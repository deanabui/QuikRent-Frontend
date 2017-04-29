var express = require('express');
var userRouter = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

var userCtrl = require('../controllers/users');
var authCtrl = require('../controllers/authentication')

userRouter.get('/:userid', userCtrl.getUser);
userRouter.post('/register', authCtrl.register);
userRouter.post('/login', authCtrl.login); //need to make this function
userRouter.put('/update/:userid', userCtrl.updateUser);
userRouter.delete('/:userid', userCtrl.deleteUser);

module.exports = userRouter; //to export routes