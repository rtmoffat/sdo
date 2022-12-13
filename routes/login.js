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
    async function asyncFunction(res) {
      let myRes;  
      try {
            myRes=await queryDb(q);
            /*
            if (process.env.USE_SQLite==1) {
                  await querySQLiteDb(q).then((myRes) => {
                    res.render('login', { title: 'Login2222', myres:myRes});
                    console.log("The type ="+typeof(myRes));
                  })
                }
              else {myRes=await queryDb(q);}*/
        } 
        catch(e) {console.log(e);}
        finally {
          res.render('login', { title: 'Login2222', myres:myRes});
          console.log("The type ="+typeof(myRes));
          console.log('done');
        }
    }
    asyncFunction(res);
});

router.post("/setCookie", (req, res) => {
    //Check if a token is already set. If so, we don't need to set it again
    if ('token' in req.headers) {
      console.log(req.headers.username+' already has a token of '+req.headers.token);
    }
    else {
      let newToken=md5(req.headers.username+process.env.SALT);
      let q='UPDATE users  set apikey=(?) WHERE username=(?)';
      let v=[newToken,req.headers.username];
      //let q='UPDATE sdo WHERE username=='+req.headers.username+' set apikey='+newToken+';';
      async function updateKey(res) {
        try {
          const myRes=await queryDb(q,v);
          console.log(myRes);
        } 
        catch(e) {console.log("Error: "+e);}
        finally {
          console.log('updated key done');
        }
      }
      updateKey(res);
      console.log('hi '+req.headers.username);
      res
        .cookie('token',newToken,{httpOnly:true,sameSite:'lax',maxAge:9000000000,path:'/'})
        .cookie('username',req.headers.username,{httpOnly:true,sameSite:'lax',maxAge:9000000000,path:'/'})
        .send()
    }
});
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
    console.log("trying");
    try {
      await sqlite.open({
        filename: 'test.db',
        driver: sql3.Database
      }).then(async function (db)
        {
          await db.all(q)
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

//querySQLite for testing
/*async function querySQLiteDb(q,v) {
  let res;
  
  console.log("trying");
  try {
    await sqlite.open({
      filename: 'test.db',
      driver: sql3.Database
    }).then(async function (db)
      {
        await db.all('select * from users;')
          .then((value) =>
            {
              console.log("value=");
              console.log(value);
              res=value;
            })
      });
  }
  catch(e) {console.log(e);}
  return res;
}*/

module.exports = router;