var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());
var md5 = require('md5');

require('dotenv').config()
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_DATABASE,connectionLimit: 5});

/* GET users listing. */
router.get('/r', function(req, res, next) {
    let q="SELECT * from users;"
    async function asyncFunction(res) {
        try {
            const myRes=await queryDb(q);
            res.render('login', { title: 'Login2222', myres:myRes });
            console.log(myRes);
        } finally {
            console.log('done');
        }
    }
    asyncFunction(res);
});

router.post("/setCookie", (req, res) => {
    let newToken=md5(req.headers.username);
    let q='UPDATE users  set apikey=(?) WHERE username=(?)';
    let v=[newToken,req.headers.username];
    //let q='UPDATE sdo WHERE username=='+req.headers.username+' set apikey='+newToken+';';
    async function updateKey(res) {
      try {
        const myRes=await queryDb(q,v);
        console.log(myRes);
      } finally {
        console.log('updated key done');
      }
    }
    updateKey(res);
    console.log('hi '+req.headers.username);
    //helper(req.headers.username);
    /*res
      .writeHead(200, {
        "Set-Cookie": "token="+newToken+"; HttpOnly",
        "Set-Cookie": "username="+req.headers.username+"; HttpOnly",
        "Access-Control-Allow-Credentials": "true"
      })
      .send();*/
    res
      .cookie('token',newToken,{httpOnly:true,sameSite:'lax',maxAge:9000000000,path:'/'})
      .cookie('username',req.headers.username,{httpOnly:true,sameSite:'lax',maxAge:9000000000,path:'/'})
      .send()
  });
  
  router.get("/private", (req, res) => {
    if (!req.cookies.token) return res.status(401).send();
    res.status(200).json({ secret: "Ginger ale is a specific Root Beer" });
  });

function helper(uname) {
  console.log('hi'+uname);
}

async function queryDb(q,v) {
  let conn;
  let res;
  //testing
  //q="SELECT * from users;";
  try {
      conn = await pool.getConnection();
      const rows = await conn.query(q,v);
      res=rows;
  }
  catch(e) {
    throw e;
  }
  finally {
      if (conn) conn.release(); //release to pool
  }
  return res;
}

module.exports = router;