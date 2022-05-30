let mysql=require('mysql')
require("dotenv").config();
module.exports= mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    port: process.env.port,
});




