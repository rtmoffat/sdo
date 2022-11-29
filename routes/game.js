var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());
var md5 = require('md5');

require('dotenv').config()
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_DATABASE,connectionLimit: 5});

router.get('/',(req,res,next) => {
    res.render('info',{username:req.cookies.username});
})
//router.post("/setCookie", (req, res) => {
module.exports = router;
