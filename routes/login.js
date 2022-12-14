var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());
var md5 = require('md5');
var sql3=require('sqlite3');
var sqlite=require('sqlite');
//import sqlite3 from 'sqlite3'
//import { open } from 'sqlite'

require('dotenv').config()
const mariadb = require('mariadb');
if (process.env.USE_SQLite !=1 ) {
  const pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_DATABASE,connectionLimit: 5});
}
/* GET users listing. */
router.get('/', function(req, res, next) {
    let q="SELECT * from users;"
    queryDb(q)
      .then((value) => {
        res.render('login', { title: 'Login2222', myres:value});
        console.log('my new db func:')
        console.log(value);
      });
});

router.post("/setCookie", (req, res) => {
    console.log('running setcookie');
    //Check if a token is already set.
    //Check that the token is valid for the username
    if (req.cookies.username && req.cookies.token) { 
      console.log(req.cookies.username+' already has a token of '+req.cookies.token);
      let q='select id from users where username=(?) and apikey=(?)';
      let v=[req.cookies.username,req.cookies.token];
      queryDb(q,v)
        .then((value) => {
          if (value.length==1) {
            console.log('Welcome back!');
            res.send('Welcome back!!');
          }
        });
      }
      else {
        //Verify username/password
        let q='select id from users where username=(?) and password=(?)';
        let v=[req.headers.username,md5(req.headers.password+process.env.SALT)];
        console.log(md5(req.headers.password+process.env.SALT));
        queryDb(q,v)
          .then((value) => {
            console.log(value);
            console.log(req.headers.username);
            if (value.length==0) {
              console.log("Username/password invalid");
              res.send('Username/password invalid!!!');
            }
            //Set the token
            else {
              console.log('login successful!! Welcome to SDO!');
              let newToken=md5(req.headers.username+process.env.SALT);
              let q='UPDATE users set apikey=(?) WHERE username=(?)';
              let v=[newToken,req.headers.username];
              queryDb(q,v)
                .then ((value) => {
                res
                  .cookie('token',newToken,{httpOnly:true,sameSite:'lax',maxAge:9000000000,path:'/'})
                  .cookie('username',req.headers.username,{httpOnly:true,sameSite:'lax',maxAge:9000000000,path:'/'})
                  .send('login successful!');
                });
            }
          });
      }
    }
);
  router.get("/private", (req, res) => {
    if (!req.cookies.token) return res.status(401).send();
    res.status(200).json({ secret: "Ginger ale is a specific Root Beer" });
  });

function helper(uname) {
  console.log('hi'+uname);
}

async function queryDb(q,v) {
  let res;
  if (process.env.USE_SQLite != 1) {
    console.log("Querying maraidb with"+q);
    let conn;
    //testing
    //q="SELECT * from users;";
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(q,v);
        res=rows;
    }
    catch(e) {
      console.log("Mariadb error"+type(e));
    }
    finally {
        if (conn) conn.release(); //release to pool
    }
  }
  else {
    console.log("trying sqlite3 db");
    try {
      await sqlite.open({
        filename: 'test.db',
        driver: sql3.Database
      }).then(async function (db)
        {
          await db.all(q,v)
            .then((value) =>
              {
                console.log("value=");
                console.log(value);
                res=value;
              })
        });
    }
    catch(e) {console.log(e);}
  }
  return res;
}


module.exports = router;