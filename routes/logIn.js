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

    let succeeded = false
    console.log(cnx.request.body)

   const clientIP = cnx.request.ip;
   //console.log(clientIP);

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
      //https://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1
      //::ffff:127.0.0.1 is correct, don't worry
      //::1 = local host


      var userAgent = require('util').inspect(cnx.userAgent)
      userAgent = userAgent.slice(1050)
      //console.log(userAgent)
      const userAgentArray = userAgent.split("'");
     // console.log(userAgentArray)
      const posOfBrowser = userAgentArray.indexOf(",\n     version: ") - 1 //get pos in array of the browser of the user as it is one behind this entry always
      const posOfPlaform = posOfBrowser + 6 //same but for platform
      var browser = userAgentArray[posOfBrowser]
      var deviceDetails = userAgentArray[posOfPlaform]
      //https://www.npmjs.com/package/koa-useragent
      //console.log(browser)
      //console.log(deviceDetails)

      let id = await model.validate(newUser);
      succeeded = true //no errors are ran so logged in successfully
      await model.saveLogin(clientIP, browser, deviceDetails, succeeded)
      cnx.response.status = 201;
      cnx.body = {message:id};
   }
   catch(error){
      await model.saveLogin(clientIP, browser, deviceDetails, succeeded)
      cnx.response.status = error.status;
      cnx.body = {message:error.message};
      //console.log(cnx.body)
      //console.log(cnx.response.status)
   }

});

module.exports = router;