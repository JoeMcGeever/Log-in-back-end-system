'use strict';

var mysql = require('promise-mysql');
var bcrypt = require('bcryptjs');

var info = require('../config');




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
