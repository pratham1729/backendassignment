let mysql=require('mysql')
module.exports= mysql.createConnection({
    host: 'localhost',
    user: 'pks',
    password: 'pratham123',
    port: 3306,
});

// conn.connect(function (err) {
//     if(err){
//         console.log("error occured while connecting");
//     }
//     else{
//         console.log("connection created with Mysql successfully");
//     }
// });


// conn.query('create database mydb', function(e,r,f){
//     if(e){
//         conn.query('use mydb', function(e,r,f){
//             if(e) throw e;
//             else{console.log("mydb selected")}
//         })
//     }
//     else{
//         console.log("mydb created")
//         conn.query('use mydb', function(e,r,f){
//             if(e) throw e;
//             else{console.log("mydb selected")}
//         })
//         conn.query('create table client(uname varchar(20), password varchar(100))', function(e,r,f){
//             if(e) throw e;
//             else{console.log("Client table created")}
//         })
//         conn.query('create table admin(uname varchar(20), password varchar(100))', function(e,r,f){
//             if(e) throw e;
//             else{console.log("Admin table created")}
//         })

//     }
// })



