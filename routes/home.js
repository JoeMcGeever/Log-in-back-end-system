'use strict';

var Router = require('koa-router');

var model = require('../models/home.js');

var router = Router({
   prefix: '/api/v1.0/home'
});  //Prefixed all routes with /api/v1.0/articles

//because we are going to parse POST parameters we will import koa-bodyparser
var bodyParser = require('koa-bodyparser');



//note that we have injected the body parser onlyin the POST request
router.delete('/delete/:id', bodyParser(), async (cnx, next) =>{
   //console.log(cnx.params.id) //how to get the passed id
   try{
      let id = await model.delete(cnx.params.id);


      console.log("Success")

      cnx.response.status = 201;
      cnx.body = {message:id};
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
      console.log("fail")
      //console.log(cnx.body)
      //console.log(cnx.response.status)
   }
});

module.exports = router;