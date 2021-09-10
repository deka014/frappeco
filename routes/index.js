const express = require('express'),
  router = express.Router(),
  passport = require('passport')

//import controllers

const indexControllers = require('../controllers/indexController')

//authorization routes

router.get('/register', indexControllers.getRegister)

//post handle sign up details

router.post('/register', indexControllers.postRegister)

//login form get
router.get('/login', indexControllers.getLogin)
//handel login logic

router.post(
  '/login',
  passport.authenticate(
    'local', //middle ware is used
    {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    }
  ),
  indexControllers.postLogin
)

//logout route
router.get('/logout', indexControllers.getLogout)

router.get('/team', indexControllers.getTeam)

router.get('/privacy', indexControllers.getPrivacy)

router.get('/terms', indexControllers.getTerms)

router.get('/contact', indexControllers.getContact)

router.post('/contact', indexControllers.postContact)

module.exports = router
