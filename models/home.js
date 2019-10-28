'use strict';

var mysql = require('promise-mysql');
var bcrypt = require('bcryptjs');

var info = require('../config');

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







