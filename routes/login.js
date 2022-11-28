var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());

require('dotenv').config()
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_DATABASE,connectionLimit: 5});

/* GET users listing. */
router.get('/r', function(req, res, next) {
    
    async function asyncFunction(res) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * from users;");
            console.log(rows);
            res.render('login', { title: 'Login2222', myres:rows });
            // rows: [ {val: 1}, meta: ... ]

            //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
            // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }

        } finally {
            if (conn) conn.release(); //release to pool
        }
    }
    asyncFunction(res);
});

router.post("/setCookie", (req, res) => {
    res
      .writeHead(200, {
        "Set-Cookie": "token=encryptedstring; HttpOnly",
        "Access-Control-Allow-Credentials": "true"
      })
      .send();
  });
  
  router.get("/private", (req, res) => {
    if (!req.cookies.token) return res.status(401).send();
    res.status(200).json({ secret: "Ginger ale is a specific Root Beer" });
  });

module.exports = router;