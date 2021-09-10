const passport = require('passport'),
  User = require('../models/user'),
  Subscribers = require('../models/subscribers')

//GET CONTROLLERS

module.exports.getRegister = function (req, res) {
  res.locals.title = ' Sign Up - Frappeco'
  res.locals.meta.description =
    'Sign-up and earn by adding content. FraPpeco is a food blog by young and ambitious food enthusiast from Guwahati, serving their unique taste. +91-9613497523 frappecoa@gmail.com'
  res.render('register')
}

module.exports.getLogin = function (req, res) {
  res.locals.title = 'Log In - Frappeco'
  res.locals.meta.description =
    'Login. Email. Password. Login. or Sign-Up to add your content in frappeco '
  res.render('login')
  // res.render("login", {message: req.flash("error")})
}

module.exports.getLogout = function (req, res) {
  req.logout()
  req.flash('success', 'Logged you out')
  res.locals.meta = { description: 'Logout', robot: 'noindex, follow' }
  res.redirect('/')
}

module.exports.getTeam = function (req, res) {
  res.locals.title = 'Our Team - Frappeco'
  res.locals.meta.description =
    'Frappe is a team of makers, tinkerers, helpers, explorers.We are young and ambitious food enthusiast from Guwahati, serving their unique taste. +91-9613497523 frappecoa@gmail.com'
  res.render('team.ejs')
}

module.exports.getPrivacy = function (req, res) {
  res.locals.title = 'Privacy Policy - Frappeco'
  res.locals.meta.description =
    'PRIVACY POLICY. Effective date: 2020-09-05. 1. Introduction. Welcome to Frappeco. Frappeco operates frappeco.com hereinafter referred to as “Service'
  res.render('privacypolicy')
}

module.exports.getTerms = function (req, res) {
  res.locals.title = 'Terms & Conditions - Frappeco'
  res.locals.meta.description =
    'These Terms of Service govern your use of our website located at frappeco.com (together or individually “Service”) operated by frappeco'
  res.render('tandC')
}

module.exports.getContact = function (req, res) {
  res.locals.title = 'Contact Us'
  res.locals.meta.description =
    'Frappeco is a food blog by young and ambitious food enthusiast from Guwahati, serving their unique taste. '
  res.render('contact')
}

//POST CONTROLLERS

module.exports.postRegister = function (req, res) {
  if (req.body.invite == 'ron123') {
    var newUser = new User({
      username: req.body.username,
      email: req.body.email,
    })

    User.register(newUser, req.body.password, function (err, user) {
      //user.register is a passport command
      if (err) {
        return res.render('register', { error: err.message }) //new way when res.render exist not res.redirect
      }
      passport.authenticate('local')(req, res, function () {
        req.flash('success', 'Welcome To Frappeco ' + user.username)
        res.redirect('/')
      })
    })
  } else {
    res.redirect('/register')
  }
}

module.exports.postLogin = function (req, res) {}

module.exports.postContact = (req, res) => {
  Subscribers.create(req.body.info, (err, subscriber) => {
    if (err) {
      req.flash('error', 'Something Went Wromg ')
      res.redirect('/')
    } else {
      console.log(req.body.info.email)
      req.flash('success', 'Thank You ! You will hear from us soon! ')
      res.redirect('/')
    }
  })
}
