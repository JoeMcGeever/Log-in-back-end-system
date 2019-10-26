//import koa
var Koa = require('koa');
//import koa-router which is used to route user request to its path
var Router = require('koa-router');

const cors = require('@koa/cors');

//create a koa instance and store it in app variable
var app = new Koa();

var router = new Router();

//http://localhost:3000/api/v1.0 -> at this route, display logIn
//Routes will go here
//maybe one for google/twitter/facebook however I think these re-route to their own websites so we don't need to care
//google does i think anyway 
var logIn = require('./routes/logIn.js')
var admin = require('./routes/admin.js')
//var googleLogin = require('./routes/passportGoogleAuth.js')


app.use(cors()); 
app.use(logIn.routes());
app.use(admin.routes())
//app.use(googleLogin.routes());
//set to be the environment/deployment port number or 3000 if there isnt one
var port = process.env.PORT || 3000; 

//run the werver on port 3000
app.listen(port); 
