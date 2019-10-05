var Router = require('koa-router');
var router = Router({
prefix: '/api/v1.0'
}); //Prefixed all routes with /api/v1.0/articles

//because we are going to parse POST parameters we will import koa-bodyparser
var bodyParser = require('koa-bodyparser');


//Routes will go here
//maybe one for google/twitter/facebook however I think these re-route to their own websites so we don't need to care
//google does i think anyway 
router.get('/', logIn);
router.get('/register', register);

function logIn(cnx, next){
cnx.body = "logIn here";

}

function register(cnx, next){
    cnx.body = "Register here";
}


module.exports = router; 