//import koa-body to extract parameters from requests (perform POST requests which we will need for logging in)
var Router = require('koa-router'); 

//Routes will go here --> not sure if we need any more than these
//maybe one for google/twitter/facebook however I think these re-route to their own websites so we don't need to care
//google does i think anyway 
router.get('/', logIn);
router.post('/register', bodyParser(), register);

function logIn(cnx, next) {
    cnx.body("logIn")
}

function register(cnx, next) {
    cnx.body("Register")
}

module.exports = router; 