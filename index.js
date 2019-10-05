//import koa
var Koa = require('koa');
//import koa-router which is used to route user request to its path
var Router = require('koa-router');


//create a koa instance and store it in app variable
var app = new Koa();

var router = new Router();

//http://localhost:3000/api/v1.0 -> at this route, display logIn
var logIn = require('./routes/logIn.js')


//app.use(router.routes());
app.use(logIn.routes());

//set to be the environment/deployment port number or 3000 if there isnt one
var port = process.env.PORT || 3000; 

//run the werver on port 3000
app.listen(port); 
