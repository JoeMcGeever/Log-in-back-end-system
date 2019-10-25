
exports.config = {
host: process.env.DB_HOST || "localhost",
port: process.env.DB_PORT || 3306,
user: process.env.DB_USER || "Joseph",
password: process.env.DB_PASSWORD || "",
database: process.env.DB_DATABASE || "304Project",
connectionLimit: 100
};