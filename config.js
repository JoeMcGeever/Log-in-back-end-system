//this will have to be set to the database we are using :D

exports.config = {
host: process.env.DB_HOST || "localhost",
port: process.env.DB_PORT || 3306,
user: process.env.DB_USER || "root",
password: process.env.DB_PASSWORD || "",
database: process.env.DB_DATABASE || "oktob",
connectionLimit: 100
};