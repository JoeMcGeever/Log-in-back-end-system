'use strict';

var Router = require('koa-router');
var passport = require('koa-passport');

var model = require('../models/logIn.js');

//for JWT session
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'geheim'; //secret is the same for every token we sign
//will be environment variable or our secret

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

    let succeeded = false
    console.log(cnx.request.body)

   const clientIP = cnx.request.ip;
   //console.log(clientIP);

    let newUser = {
      username : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.username, 
      password : cnx.request.body.values === undefined ? undefined: cnx.request.body.values.password,


    };

    console.log(newUser)
   try{
      

      //added app.proxy=true in index for this to work
      //installed koa-useragent
      //https://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1
      //::ffff:127.0.0.1 is correct, don't worry
      //::1 = local host

     // var userAgent = require('util').inspect(cnx.userAgent)

      //console.log(userAgent)

      var browser = cnx.userAgent.browser 
      var deviceDetails = cnx.userAgent.platform 


      //console.log(browser)
      //console.log(deviceDetails)

      await model.validate(newUser);
      succeeded = true //no errors are ran so logged in successfully




      await model.saveLogin(newUser.username, clientIP, browser, deviceDetails, succeeded)



      //for JWT session:
      const payload = { sub: newUser.username }; //sub = subject; usually be a username/id which identifies a user
      const token = jwt.sign(payload, secret); //payload = actual data we want to store in token
      //and a secret key that we can sign the token with (only server will know)


      
      cnx.response.status = 201;
      cnx.body = token; //returns in the body, the JWT token

   //   cnx.response.status = 201;
   //   cnx.body = {message:id};
   }
   catch(error){
      await model.saveLogin(newUser.username, clientIP, browser, deviceDetails, succeeded)
      cnx.response.status = error.status;
      console.log("Error:")
      console.log(error)
      cnx.body = error.message;
      
   }

});

module.exports = router;
