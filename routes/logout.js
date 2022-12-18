var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.get("/",(req,res) => {
  res
    .cookie('token','',{httpOnly:true,sameSite:'lax',maxAge:9000000000,path:'/'})
    .cookie('username','',{httpOnly:true,sameSite:'lax',maxAge:9000000000,path:'/'})  
    .send("You have been logged out")
});

module.exports = router;