'use strict';

var mysql = require('promise-mysql');
var bcrypt = require('bcryptjs');

var info = require('../config');

//for JWT session
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'geheim'; //secret is the same for every token we sign
//will be environment variable or our secret

exports.delete = async (id) => {
    try {


        //server validation rules 
        //note that we needed to escape the ' character in roder to make the sql statement works
        let sql = `SELECT deleted from user WHERE
                    id = \'${id}'`;
        const connection = await mysql.createConnection(info.config);


        var data = await connection.query(sql);

        if(data.length == 0){
            throw {message:'user not found', status: 400};
        } else if (data[0].deleted == 1) {
            throw {message:'account already deleted', status: 400}
        } else if (data[0].deleted == 0){
        sql = `UPDATE user 
                   SET deleted = true
                   WHERE id = \'${id}'`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Deleted!");
          });
        } 
        await connection.end();
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}


exports.getOne = async (id) => {
    try {

        let sql = `SELECT * from loginhistory WHERE
                    id = \'${id}'`;
        const connection = await mysql.createConnection(info.config);
        var data = await connection.query(sql);

        if(data.length == 0){
            throw {message:'not found', status: 400};
        } 
        await connection.end();
        return data
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}




exports.getAccountInfo = async (username) => {
    try {
        //maybe profile image if nourah implements
        let sql = `SELECT username, firstName, lastName, email, about, dateRegistered, countryID, profileImageURL from user WHERE
                    username = \'${username}'`;
        const connection = await mysql.createConnection(info.config);
        var data = await connection.query(sql);
        if(data.count==0) throw {message:'no user found', status: 400};
        await connection.end();

        let date = String(data[0].dateRegistered)
        date = date.slice(0, -40) //slicing off last part
        data[0].dateRegistered = date

        return data
    } catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

exports.updateAccountInfo = async (jwtUsername, username, firstName, lastName, email, about, countryID, profileImageURL) => {
    //update the JWT --> TALK ABOUT THIS IN YOUR REPORT
    //UPDATED JWT TO HOLD THE NEW USERNAME INFO
    //THIS SHOULD BE WHAT IS RETURNED
    //this is so the look up username method
    //to find detais will still work
    try {
        let sql = `UPDATE user
        SET username = \'${username}', firstName= \'${firstName}', lastName= \'${lastName}', email= \'${email}', about= \'${about}', countryID= \'${countryID}', profileImageURL= \'${profileImageURL}'
        WHERE username = \'${jwtUsername}'`;
        const connection = await mysql.createConnection(info.config);
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Updated");
          });
        await connection.end();
    } catch (error) {
        console.log(error)
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}






