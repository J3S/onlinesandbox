var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session      = require('express-session');
var flash    = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/usuarios');
var ejercicios = require('./routes/ejercicios');
var cursos = require('./routes/cursos');
var login = require('./routes/login');
var reportes = require('./routes/reportes');
var logout = require('./routes/logout');

var app = express();

//var db = require('./models/db');
var ejercicio = require('./models/ejercicios');
var dificultad = require('./models/dificultads');
var etiqueta = require('./models/etiquetas');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
var hbs = require('hbs');
hbs.registerHelper('if_eq', function(a, b, opts) {
        if(a == b)
            return opts.fn(this);
        else
            return opts.inverse(this);
}); 
hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/node_modules/slimscroll',  express.static(__dirname + '/node_modules/jquery-slimscroll'));
app.use('/node_modules/chartjs',  express.static(__dirname + '/node_modules/chartjs'));
app.use('/node_modules/knob',  express.static(__dirname + '/node_modules/jquery-knob'));


// required for passport
require('./config/passport')(passport); // pass passport for configuration
app.use(session({secret:'somesecrettokenhere'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use('/index', index);
app.use('/usuarios', users);
app.use('/ejercicios', ejercicios);
app.use('/cursos', cursos);
app.use('/login', login);
app.use('/reportes', reportes);
app.use('/logout', logout);

app.get('/', function (req, res) {
  return res.redirect('/index');
})

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

var uristring = 'mongodb://proyecto:parcial2@ds157549.mlab.com:57549/proyectodaw';
mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR DE CONEXIÓN CON LA BASE DE DATOS' + err);
      } else {
      console.log ('CONEXIÓN REALIZADA EXITOSAMENTE');
      }
});

module.exports = app;
