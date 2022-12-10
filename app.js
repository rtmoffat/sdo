var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
//
//NOTE: app needs to be defined BEFORE setting up express websockets
//websockets needs to be defined BEFORE routers are defined
var expressWs = require('express-ws')(app);
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var gameRouter = require('./routes/game');
//
app.set('views','./views');
app.set('view engine','pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/game',gameRouter);

app.listen(3001);
module.exports = app;
