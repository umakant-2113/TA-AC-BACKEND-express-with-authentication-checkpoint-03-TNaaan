var express = require('express');
let passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  
  res.render('index', { title: 'Express' });
});

router.get('/auth/github', passport.authenticate('github'));
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/users/login' }),
  (req, res) => {
    res.redirect('/users/register');
  }
);

// google auth

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: "/users/register",
    failureRedirect: '/users/login',
  })
);



module.exports = router;
