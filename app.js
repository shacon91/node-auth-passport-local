var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require("express-validator");
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require("bcrypt");


/*------------------ Routes ------------------------*/
var index = require('./routes/index');
var register = require('./routes/register');
var login = require('./routes/login');
var profile = require('./routes/profile');
var logOut = require('./routes/logOut');

var app = express();
require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 
var sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
  //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('/', index);
app.use('/register', register);
app.use('/login', login);
app.use('/profile', profile);
app.use('/log-out', logOut);




passport.use(new LocalStrategy(  
  {
    usernameField:'email',
    passwordField:'password'
  },
    function(username,password,done){
        const db = require("./config/connect.js");

        db.query("SELECT id,password FROM users WHERE email=?",username,function(error,result){
            if(error){ done(error)};

            if(result.length === 0){
                done(null,false);
            }else{
                var hash = result[0].password.toString();
                bcrypt.compare(password, hash, function(err, res) {
                  //if(error){done(error)};

                  if(res === true){
                    return done(null, {user_id:result[0].id});
                  }else{
                    return done(null,false);
                  }
                });
            }  
        });
    }
));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
