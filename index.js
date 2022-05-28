const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const conn = require('./db');
conn.connect();
const app = express();
app.set('view engine', 'ejs');

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 ;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}))

//setting up cookkie parser
app.use(cookieParser());

var session;
 
// prerequisite database
conn.connect(function (err) {
    if(err){
        console.log("don't worry it works");
    }
    else{
        console.log("connection created with Mysql successfully");
    }
});


conn.query('create database mydb', function(e,r,f){
    if(e){
        conn.query('use mydb', function(e,r,f){
            if(e) throw e;
            else{console.log("mydb selected")}
        })
    }
    else{
        console.log("mydb created")
        conn.query('use mydb', function(e,r,f){
            if(e) throw e;
            else{console.log("mydb selected")}
        })
        conn.query('create table client(uname varchar(20), password varchar(100))', function(e,r,f){
            if(e) throw e;
            else{console.log("Client table created")}
        })
        conn.query('create table admin(uname varchar(20), password varchar(100))', function(e,r,f){
            if(e) throw e;
            else{console.log("Admin table created")}
        })

    }
})


//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ENVs
const PORT = process.env.PORT || 5500;
app.listen(PORT, () =>
    console.log(`server started at ${PORT}`));

//Requests
const router = express.Router();

app.use('/',router);
router.get('/', (req, res) => {
    res.render('index');
});
 //navigating between pages
router.get('/home', (req, res) => {
    res.render('index');
});
router.get('/register', (req, res) => {
   res.render('register');
});
router.get('/client', (req, res) => {
   res.render('client');
});
router.get('/admin', (req, res) => {
   res.render('admin');
});

//login requets
router.post('/clientlogin', (req, res) => {
   conn.query('select * from client where uname =' + conn.escape(req.body.username) + ';',
       (error, result, fields) => {
           let crypto = require('crypto');
           const hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
           if (error) {
               return res.render('notClient');
           }
           else {
            let crypto = require('crypto');
            const bcrypt = require("bcrypt");
            const plainTextPassword1 = req.body.password;
            const hash = result[0].password;
            bcrypt
            .compare(plainTextPassword1, hash)
            .then(xyz => {
                if (result[0] != undefined && xyz) {
                    session=req.session;
                    session.userid=req.body.username;
                    console.log(req.session)
                    return res.render('clientUser');
            
               }
               else {
                    return res.render('notClient');
               }
            })
           }
       });
});

router.post('/adminlogin', (req, res) => {
   conn.query('select * from admin where uname =' + conn.escape(req.body.username) + ';',
       (error, result, fields) => {
        //    const hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
           if (error) {
               return res.redirect('notUser');
           }
           else {
            let crypto = require('crypto');
            const bcrypt = require("bcrypt");
            const plainTextPassword1 = req.body.password;
            const hash = result[0].password;
            bcrypt
            .compare(plainTextPassword1, hash)
            .then(xyz => {
                if (result[0] != undefined && xyz) {
                    session=req.session;
                    session.userid=req.body.username;
                    console.log(req.session)
                    return res.render('adminUser');
            
               }
               else {
                    return res.render('notAdmin');
               }
            })
           }
       });
});

router.post('/register2', (req, res) => {
    let name = req.body.uname;
    let password = req.body.password;
    var crypto = require('crypto');
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    bcrypt
    .genSalt(saltRounds)
    .then(salt => {
    return bcrypt.hash(password, salt);
    })
    .then(hash => {
    // Store hash in your password DB.
    let passwordC = req.body.passwordC;
    conn.query("select * from client where uname = " + conn.escape(name) + ";",
        (error, result, field) => {
            if (result[0] === undefined) {
                if (name && (password == passwordC)) {
                    conn.query("INSERT INTO client VALUES(" + conn.escape(name) + ",'" + hash+"');");
                    res.render('client');                  
                }
                else if (password !== passwordC) {
                    res.send("Passwords didn't match");
                }
                else {
                    res.send("password must not be emply");
                }
            }
            else {
                res.send("Username is not unique");
            }
        });
 });
    })


//logout request
router.get('/logout', (req, res) => {
    req.session.destroy();
    console.log(req.session)
    res.render('index');
});

