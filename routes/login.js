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
    let q="SELECT * from user;"
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
    console.log('hi '+req.headers.username);
    //helper(req.headers.username);
    res
      .writeHead(200, {
        "Set-Cookie": "token="+newToken+"; HttpOnly",
        "Access-Control-Allow-Credentials": "true"
      })
      .send();
  });
  
  router.get("/private", (req, res) => {
    if (!req.cookies.token) return res.status(401).send();
    res.status(200).json({ secret: "Ginger ale is a specific Root Beer" });
  });

function helper(uname) {
  console.log('hi'+uname);
}

async function queryDb(q) {
  let conn;
  let res;
  //testing
  //q="SELECT * from users;";
  try {
      conn = await pool.getConnection();
      const rows = await conn.query(q);
      res=rows;
  }
  catch {
    res="error";
  }
  finally {
      if (conn) conn.release(); //release to pool
  }
  return res;
}

module.exports = router;