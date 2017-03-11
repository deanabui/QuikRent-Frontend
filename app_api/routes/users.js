var express = require('express');
var userRouter = express.Router();
var userCtrl = require('../controllers/users');

userRouter.get('/:userid', userCtrl.getUser);
userRouter.post('/new', userCtrl.createUser);
userRouter.put('/update/:userid', userCtrl.updateUser);
userRouter.delete('/:userid', userCtrl.deleteUser);

module.exports = userRouter; //to export routes