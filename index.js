const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const conn = require('./db');
const { NULL } = require('mysql/lib/protocol/constants/types');
conn.connect();
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
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
        conn.query('create table books(bname varchar(20), bid int primary key,issued_by varchar(20) default NULL)', function(e,r,f){
            if(e) throw e;
            else{console.log("Book table created")}
        })
        conn.query('create table request(bid int, requested_by varchar(20))', function(e,r,f){
            if(e) throw e;
            else{console.log("Request table created")}
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
   res.render('registerC');
});
router.get('/register2', (req, res) => {
    res.render('registerA');
 });
router.get('/client', (req, res) => {
    res.render('client');

});
router.get('/admin', (req, res) => {
   res.render('admin');
});

router.get('/clienthome', (req, res) => {
    res.render('clientUser',{data:session.userid});
 });

router.get('/adminhome', (req, res) => {
    res.render('admintUser',{data:session.userid});
});
router.get('/requestportal', (req, res) => {
    conn.query("select * from books;",(error,result1,fields)=>{
        conn.query("select * from request;",(error,result2,fields)=>{
            res.render('requestportal',{data1:result1,data2:result2,name:session.userid});
        })
    })
});

router.get('/issuedbooks', (req, res) => {
    conn.query("select * from books;",(error,result,fields)=>{
    res.render('issued',{data:result,name:session.userid})
    }) 
});

router.get('/requestedbooks', (req, res) => {
    conn.query("select distinct * from request where requested_by='"+session.userid+"';",(error,result,fields)=>{
    res.render('requested',{data:result,name:session.userid})
    }) 
});

router.get('/viewbooks', (req, res) => {
    conn.query("select * from books;",(error,result,fields)=>{
    res.render('booksadmin',{data:result,name:session.userid})
    })
 });

 //login requets
router.post('/clientlogin', (req, res) => {
    conn.query('select * from client where uname =' + conn.escape(req.body.username) + ';',
        (error, result, fields) => {
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
                        return res.render('clientUser',{data:req.body.username});
                
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
//admin register
router.post('/registeradmin', (req, res) => {
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
    conn.query("select * from admin where uname = " + conn.escape(name) + ";",
        (error, result, field) => {
            if (result[0] === undefined) {
                if (name && (password == passwordC)) {
                    conn.query("INSERT INTO admin VALUES(" + conn.escape(name) + ",'" + hash+"');");
                    res.render('admin');                  
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

//client register
router.post('/registerclient', (req, res) => {
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

//bookrequest
router.post('/makerequest', (req, res) => {
    conn.query(`insert into request values(${req.body.bookid},"${req.body.username}","${req.body.bookname}");`) 
});

//returnbook
router.post('/return', (req, res) => {
    conn.query(`update books set issued_by=null where bid=${req.body.bookid};`)
    conn.query("select * from books;",(error,result,fields)=>{
    res.render('issued',{data:result,name:session.userid})
    }) 
});

//cancelrequest
router.post('/cancelrequest', (req, res) => {
    conn.query(`delete from request where bid=${req.body.bookid} and requested_by="${req.body.username}";`)
    conn.query("select distinct * from request where requested_by='"+session.userid+"';",(error,result,fields)=>{
    res.render('requested',{data:result,name:session.userid})
    }) 
});

//add book

router.post('/addbook', (req, res) => {
    conn.query(`insert into books values("${req.body.bookname}",${req.body.bookid},null);`)
    conn.query("select * from books;",(error,result,fields)=>{
    res.render('booksadmin',{data:result,name:session.userid})
    }) 
});
//remove book
router.post('/removebook', (req, res) => {
    conn.query(`delete from books where bid=${req.body.bookid};`)
    conn.query("select * from books;",(error,result,fields)=>{
    res.render('booksadmin',{data:result,name:session.userid})
    }) 
});

//logout request
router.get('/logout', (req, res) => {
    req.session.destroy();
    console.log(req.session)
    res.render('index');
});

