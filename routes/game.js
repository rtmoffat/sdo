var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());
var md5 = require('md5');

require('dotenv').config()
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_DATABASE,connectionLimit: 5});

router.get('/:gameid?',(req,res,next) => {
    //players(names)
    //feeds(ids)
    var q='select userid,username from players join users on players.userid=users.id where gameid=2;';
    querydb(q)
        .then((value) => {res.render('game',{username:req.cookies.username,gameid:req.params.gameid,"res":value,"lres":value.length});},
        (error) => { console.log(error); });
})

async function querydb(myq) {
    return await pool.query({rowsAsArray: false,sql:myq});
}
//router.post("/setCookie", (req, res) => {
module.exports = router;
