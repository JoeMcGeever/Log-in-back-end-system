
'use strict';

var mysql = require('promise-mysql');
var info = require('../config');

exports.createTables = async ()=> {

    try {

        const connection = await mysql.createConnection(info.config);

        //this is the sql statement to execute
        let sql = `CREATE TABLE articles (
                    ID INT NOT NULL AUTO_INCREMENT,
                    title VARCHAR(32),
                    allText TEXT,
                    published TINYINT(1),
                    views INT,
                    imageURL VARCHAR(2048),
                    created DATETIME,
                    PRIMARY KEY (ID)
                )`;
        await connection.query(sql);

        sql = `CREATE TABLE users (
                ID INT NOT NULL AUTO_INCREMENT,
                email VARCHAR(32) UNIQUE,
                forename VARCHAR(16),
                surname VARCHAR(16),
                pwd VARCHAR(256),
                created DATETIME,
                PRIMARY KEY (ID)
            )`;

        await connection.query(sql);
        
        return {message:"created successfully"};

    } catch (error) {
        console.log(error);
    }

}