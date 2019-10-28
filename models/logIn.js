'use strict';

var mysql = require('promise-mysql');
var bcrypt = require('bcryptjs');

var info = require('../config');


//get an article by its id
exports.getById = async (id) => {
  try {
    //first connect to the database
    const connection = await mysql.createConnection(info.config);
    //this is the sql statement to execute
    let sql = `SELECT * FROM users
               WHERE id = ${id}
            `;
    //wait for the async code to finish
    let data = await connection.query(sql);
    //wait until connection to db is closed
    await connection.end();
    //return the result
    return data;
  }catch (error) {
    //if an error occured please log it and throw an exception
    throw new Error(error)
  }
}


exports.validate = async (user) => {
    try {
        //NOTE: FOR USER SAVED IN DB:
        //USERNAME = "Joseph", PASSWORD = "Joseph"

        
        //server validation rules 
        //email is required        
        if(user.username === undefined){
            throw {message:'username is required', status:400};
        }
        //password is required
        if(user.password === undefined){
            throw {message:'password is required', status:400};
        }
        //final check is to make sure that email should be unique and never been used in the system
        //note that we needed to escape the ' character in roder to make the sql statement works
        let sql = `SELECT ID, passwordSalt, password from user WHERE
                    username = \'${user.username}'`;
        const connection = await mysql.createConnection(info.config);
        var data = await connection.query(sql);

        //creates sql statement to locate the user based on username
        let salt = ""
        try{
            salt = data[0].passwordSalt //set salt to be the saved salt for the user
        } catch {
            throw {message:'user not found', status:400}
        }

        let password = bcrypt.hashSync(user.password, salt);

        await connection.end();

        if(password == data[0].password) {
            console.log("Correct details");
            return data[0].id;
        }

        return data;

    } catch (error) {
        //in case we caught an error that has no status defined then this is an error from our database
        //therefore we should set the status code to server error
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}







exports.add = async (user) => {
	try {
        
        //server validation rules 
        //email is required        
        if(user.email === undefined){
            throw {message:'email is required', status:400};
        }
        //password is required
        if(user.password === undefined){
            throw {message:'password is required', status:400};
        }
        else{
            //if password is provided it must be ay least 6 characters long
            if(user.password.length < 6){
                throw {message:'password must be more than 6 characters long', status:400};
            }
        }
        //passwordConfrimation is required
        if(user.passwordConfirmation === undefined){
            throw {message:'password confirmation is required', status:400};
        }
        else{
            //if passwordConfirmation is provided then it must match password
            if(user.password !== user.passwordConfirmation ){
                throw {message:'passwords don\'t match', status:400};
            }
        }
        //email should be a valid email address
        //we will use a regular expression to validate the email format
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(String(user.email).toLowerCase()))
            throw {message:'invalid email address format', status:400};

        //final check is to make sure that email should be unique and never been used in the system
        //note that we needed to escape the ' character in roder to make the sql statement works
        let sql = `SELECT email from Users WHERE
                    email = \'${user.email}\'`;
        
        const connection = await mysql.createConnection(info.config);
        let data = await connection.query(sql);

        //if the query return a record then this email has been used before
        if(data.length){
            //first close the connection as we are leaving this function
            await connection.end();
            //then throw an error to leave the function
            throw {message:'email address already in use', status:400};
        }

        //hash the password using bcryptjs package
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(user.password, salt);

        //create a new object to hold users final data
        let userData = {
            email: user.email, 
            pwd: hash,
            forename: user.forename,
            surname: user.surname,
            created: new Date()
        }
        
        //this is the sql statement to execute
		sql = `INSERT INTO users
					SET ?
                `;
                
        data = await connection.query(sql, userData);
		
		await connection.end();

        return data;

    } catch (error) {
        //in case we caught an error that has no status defined then this is an error from our database
        //therefore we should set the status code to server error
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}