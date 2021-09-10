//Environment varibales package configuration
require('dotenv').config()

//Importing node_modules and routes
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  faker = require('faker'),
  session = require('express-session'),
  User = require('./models/user'),
  commentRoutes = require('./routes/comment'),
  foodRoutes = require('./routes/food'),
  indexRoutes = require('./routes/index'),
  MongoStore = require('connect-mongo')(session)

mongoose.set('useUnifiedTopology', true)

//Mongoose connection setup
mongoose
  .connect(process.env.MONGO_DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())

//Passsport configuration for authentication
app.use(
  session({
    secret: process.env.PASSPORT_SESSION_SECRET,
    // resave				: false,
    // saveUninitialized 	: false
    cookie: { maxAge: 60000 * 60 * 24 * 7 }, //in milliseconds.
    resave: false, //Don't save the session to store if it hasn't changed
    rolling: true, //Reset the cookie Max-Age on every request
    saveUninitialized: false, //Don't create a session for anonymous users
    secret: process.env.PASSPORT_SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

app.use(passport.initialize())
app.use(passport.session())
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      usernameQueryFields: ['email'],
    },
    User.authenticate()
  )
)
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function (req, res, next) {
  // now  you dont need to them to the ejs separetly
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.message = req.flash('success')
  ;(res.locals.title = 'Frappeco - Never go empty'),
    (res.locals.meta = {
      description:
        'Frappeco is a platform to everyone, starting from gourmets and connoisseur to bibliophiles to share their relishing memories of food.',
      robot: 'index, follow, max-snippet:-1, max-image-preview:large ',
    })
  res.locals.paginatedUrl =
    req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + '?'
  next()
})

//Using the route files

app.use(indexRoutes)
app.use(foodRoutes)
app.use('/:id/:id1/comments', commentRoutes)

app.listen(process.env.PORT || 5000, function () {
  console.log('Server started')
})
