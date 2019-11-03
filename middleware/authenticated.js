const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'geheim';
//note:
//the way JWT is passed from front end to back end is through an auth header
//the value starts with the word "Bearer" and then, after a space, is the actual token

module.exports = async (ctx, next) => {
    if (!ctx.headers.authorization) ctx.throw(403, 'No token.');
    //if no token is present, 403 error is thrown
    const token = ctx.headers.authorization.split(' ')[1]; //read note above
    try { //verifies the token
        ctx.request.jwtPayload = jwt.verify(token, secret);
        //jwt.verify returns tokens payload (and sub (username of user))
        //it is set to ctx.request.jwtPayload
        //this can be used down the middleware chain
        //so for fucntions that need to use the token
        //or even to validate user is logged in
        //put this file within the index.js use for it
      } catch (err) {
        ctx.throw(err.status || 403, err.text);
      }
    await next();
  };