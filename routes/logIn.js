'use strict';

var Router = require('koa-router');
var passport = require('koa-passport');

var model = require('../models/logIn.js');

var router = Router({
   prefix: '/api/v1.0/users'
});  //Prefixed all routes with /api/v1.0/articles

//because we are going to parse POST parameters we will import koa-bodyparser
var bodyParser = require('koa-bodyparser');

router.get('/google', async (cnx, next) =>{
  
  console.log("HI")
})

//note that we have injected the body parser onlyin the POST request
router.post('/', bodyParser(), async (cnx, next) =>{

    console.log(cnx.request.body);

    //prevent server crash if values is undefined
    let newUser = {
       email : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.email, 
       password : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.password,
       passwordConfirmation: cnx.request.body.values === undefined ? undefined: cnx.request.body.values.passwordConfirmation
    };
   try{
      await model.add(newUser);
      cnx.response.status = 201;
      cnx.body = {message:"user was added successfully"};
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
   

});

module.exports = router;