'use strict';

var Router = require('koa-router');

var model = require('../models/home.js');

var router = Router({
   prefix: '/api/v1.0/home'
});  //Prefixed all routes with /api/v1.0/articles

//because we are going to parse POST parameters we will import koa-bodyparser
var bodyParser = require('koa-bodyparser');

const authenticated = require('../middleware/authenticated');

//note that we have injected the body parser onlyin the POST request
router.delete('/delete/:id', bodyParser(), async (cnx, next) =>{
   //console.log(cnx.params.id) //how to get the passed id
   try{
      let id = await model.delete(cnx.params.id);
      cnx.response.status = 201;
      cnx.body = {message:id};
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
});


router.get('/getOne/:id',  authenticated, async (cnx, next) =>{
   try{
      let id = await model.getOne(cnx.params.id)
      console.log("Success")
      //console.log(id)
      //attemptDate: 2019-10-30T00:00:00.000Z
      let date = String(id[0].attemptDate)
      date = date.slice(0, -40) //slicing off last part
      id[0].attemptDate = date
      cnx.response.status = 201;
      cnx.body = id
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
});

router.get('/getAll', authenticated, async (cnx, next) =>{ 
   //NOTE
   //THIS GETALL WILL ONLY WORK WHEN THE REQUESTS
   //ARE SENT FROM AN AUTHORISED ACCOUNT
   //I THINK THE HEADER WILL CONTAIN THE USERNAME
   //IN ORDER TO BE USED FOR THE SEARCH
   //WHEN SOMEONE LOGS IN
   console.log("HI")
   try{
      let id = await model.getAll()
      //console.log("Success")
      cnx.response.status = 201;
      cnx.body = {message:id};
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
});


router.get('/getAccountInfo',  authenticated, async (cnx, next) =>{

   try {
        const user = cnx.request.jwtPayload.sub
        //console.log(user)
        let results = await model.getAccountInfo(user)
        //console.log(results)
        cnx.response.status = 200
        cnx.body = results
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
   }
});

module.exports = router;