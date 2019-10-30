'use strict';

var Router = require('koa-router');
var passport = require('koa-passport');

var model = require('../models/logIn.js');

var router = Router({
   prefix: '/api/v1.0/users'
});  //Prefixed all routes with /api/v1.0/articles

//because we are going to parse POST parameters we will import koa-bodyparser
var bodyParser = require('koa-bodyparser');





//note that we have injected the body parser onlyin the POST request
router.post('/', bodyParser(), async (cnx, next) =>{

    //console.log(cnx.request.body);
    //prevent server crash if values is undefined
    //console.log(cnx.request.body.username);

    console.log(cnx.request.body)

    let newUser = {
       username : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.username, 
       password : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.password,

      // username = cnx.request.body.values.username || undefined,
      // password = cnx.request.body.values.password || undefined
    };

    console.log(newUser)

   try{
      

      //added app.proxy=true in index for this to work
      //installed koa-useragent
      const clientIP = cnx.request.ip;
      console.log(clientIP);
      //https://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1
      //::ffff:127.0.0.1 is correct, don't worry
      //::1 = local host


      console.log(require('util').inspect(cnx.userAgent))

      const userAgent = require('util').inspect(cnx.userAgent)
      var browser = "EXTRACT FROM userAgent"
      var device = "ditto"



      let id = await model.validate(newUser);
      cnx.response.status = 201;
      cnx.body = {message:id};
   }
   catch(error){
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
      //console.log(cnx.body)
      //console.log(cnx.response.status)
   }
   

});

module.exports = router;