const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./config/db');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// helpers
const helpers = require('./helpers');

// create the db conection
/* db.authenticate().then(() => {
  console.log('conectado al servidoor');
}).catch((e) => {
  console.log(e);
  console.log('error');
}); */

// import the model
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync().then(() => {
  console.log('conectado al servidoor');
}).catch((e) => {
  console.log(e);
  console.log('error');
});

// create express app
const app = express();

// load static files
app.use(express.static('public'));

// set template (pug)
app.set('view engine', 'pug');

// enabled bodyParser fo
app.use(bodyParser.urlencoded({extended: true}));

// add views folder
app.set('views', path.join(__dirname, './views'));

// agregar flass messages
app.use(flash());

app.use(cookieParser());

// sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
  secret: 'supersecreto',
  resave: false,
  saveUninitialized: false
}));

// passport authentication
app.use(passport.initialize());
app.use(passport.session());

// pasar helper
app.use((req, res, next) => {
  // craate variables to use in any file
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = flash();
  res.locals.usuario = {...req.user} || null;
  next();
});


// set home routes
app.use('/', routes());

// set poort
app.listen(3000);


// require('./handlers/email');

