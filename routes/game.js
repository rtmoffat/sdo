var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser());
var md5 = require('md5');
var sql3=require('sqlite3');
var sqlite=require('sqlite');
require('dotenv').config()
var connections={};
const mariadb = require('mariadb');
if (process.env.USE_SQLite !=1) {
    const pool = mariadb.createPool({host: process.env.DB_HOST, port: process.env.DB_PORT,user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_DATABASE,connectionLimit: 5});
}
router.get('/:gameid?',async (req,res,next) => {
    if (await authorized(req)==false)
    {
      console.log('unauthorized!!');
      res.render("login");
      //res.send('Unauthorized');
    }
    else
    {
      let topts={};
      //players(names)
      //feeds(ids)
      var q='select userid,username,gameid,name from players join users on users.id=players.id join games on games.id=players.gameid where gameid=1;';
      await queryDb(q)
          .then((value) => {
            topts['players']=value;},
            //res.render('layout_final',{"username":req.cookies.username,"gameid":req.params.gameid,"res":value,"lres":value.length,"username2":req.cookies.username});console.log(value);},
          (error) => { console.log(error); });
      var q='select name from games;';
      await queryDb(q)
          .then((value) => {
            topts['games']=value;},
            //res.render('layout_final',{"username":req.cookies.username,"gameid":req.params.gameid,"res":value,"lres":value.length,"username2":req.cookies.username});console.log(value);},
          (error) => { console.log(error); });
      var q='select subject from feeds;';
      await queryDb(q)
          .then((value) => {
            topts['feeds']=value;},
            ///res.render('layout_final',{"username":req.cookies.username,"gameid":req.params.gameid,"res":value,"lres":value.length,"username2":req.cookies.username});console.log(value);},
          (error) => { console.log(error); });
      var q='select text from comments where feedid=1;';
      await queryDb(q)
          .then((value) => {
            topts['comments']=value;},
            ///res.render('layout_final',{"username":req.cookies.username,"gameid":req.params.gameid,"res":value,"lres":value.length,"username2":req.cookies.username});console.log(value);},
          (error) => { console.log(error); });
      console.log("topts=");
      console.log(topts);
      res.render('layout_final',{"username":req.cookies.username,"gameid":req.params.gameid,"res":topts,"lres":topts.length,"username2":req.cookies.username});
    } 
})

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
  
async function querydb2(myq) {
    return await pool.query({sql:myq});
}
router.post("/addComment", async (req,res) => {
  let comment=req.headers.comment;
  let username=req.cookies.username;
  let token=req.cookies.token;
  let uquery="select id from users where username='ralph'";
  let cquery="insert into comments(userid,text,feedid) values(1,'hi there2',1);";
  await queryDb(uquery)
    .then(async (value) => {
      await queryDb(cquery)
        .then((value) => {
          res.send(value);
        })
    }),
    (error) => {
      res.send(error);
    }
  });
//WebSocket routes for chat rooms

router.ws('/echo',(ws,req) => {
  console.log("echoing");
  console.log(connections);
  connections[req.cookies.username]=ws;
  ws.on("message",(msg) => {
    for (const key in connections) {
      if (Object.hasOwnProperty.call(connections, key)) {
        connections[key].send('hello, '+key+Date.now());
      }
    }
  });
  
  /*ws.on("message",(msg) => {
    console.log("Sending it back to client");
    ws.send('hello '+req.cookies.username+' from the server!');
  });*/
});

/*
//This is how to you send messages to everyone who has established a web socket connection to the server
//Verify that the user is in the chat room before sending them a message
var connections = []
app.ws("/your/ws/path/here", (ws,res)=>{
    connections.push(ws)
    //whatever other stuff here, you could also have it be an object storing stuff about the ws that contains it.
})
function broadcast(message){
    connections.forEach((ws)=>{
        //if the connections are objects with info use something like ws.ws.send()
        ws.send(message)
    })
}*/
async function authorized(req) {
  let nrows;
  if (!req.cookies.token || !req.cookies.username) {
    return false;
  }
  var q='select id from users where username=(?) and apikey=(?)';
  v=[req.cookies.username,req.cookies.token];
  await queryDb(q,v)
    .then((res) => {
        console.log('myval=');
        console.log(res);
        nrows=res;
    });
  if (nrows.length==0) {
    console.log('no records found');
    return false;
  }
  console.log('nrows = ');
  console.log(nrows);
}
module.exports = router;
