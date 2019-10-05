//import koa
var Koa = require('koa');
//import koa-router which is used to route user request to its path
var Router = require('koa-router');


//create a koa instance and store it in app variable
var app = new Koa();

var router = new Router();

router.get('/api/v1.0', welcomeAPI);
//http://localhost:3000/api/v1.0 -> at this route, display welcomeAPI
var logIn = require('./routes/logIn.js')
//use the root routes
//import the Router we defined in logIn.js
//var router= require('./routes/logIn.js');
//apply the routes as a middleware
app.use(router.routes());
app.use(logIn.routes());

//run the werver on port 3000
app.listen(3000); 


function welcomeAPI(cnx, next){
cnx.body = {message:'Welcome to Oktob API version 1.0'};
}