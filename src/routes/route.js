const express= require('express');
const route= express.Router();
const controller= require('../controllers/controller');
const middlewWare= require('../middleWares/auth');

route.post('/create', controller.create);
route.get('/login', controller.logIn);
route.get('/getAll', middlewWare.auth , controller.getAll);
route.get('/getData', middlewWare.auth, controller.getData);
route.get('/forgetPassword', controller.forgetPassword);
route.put('/updatePassword', controller.changePassword);

module.exports= route;