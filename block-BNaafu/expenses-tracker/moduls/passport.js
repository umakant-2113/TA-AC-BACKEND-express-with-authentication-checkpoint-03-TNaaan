let passport=require("passport")
// let LocalStrategy = require('passport-local').Strategy;
let GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;

require('dotenv').config()
let User = require('../models/User');


passport.use(new GitHubStrategy({
    clientID: process.env.git_client_id,
    clientSecret: process.env.git_client_secret,
    callbackURL: "/auth/github/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    let email = profile._json.email;
    let githubUser = {
      email: email,
      providers: [profile.provider],
      github: {
        name: profile.displayName,
        username: profile.username,
        image: profile.photos[0].value,
      },
    };

    User.findOne({ email: profile._json.email }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        User.create(githubUser, (err, addUser) => {
          if (err) return done(err);
          return done(null, addUser);
        });
      }
      done(null, user);
    });
  }
));

// login with google

passport.use(new GoogleStrategy({
    clientID: process.env.google_client_id,
    clientSecret: process.env.google_client_secret,
    callbackURL: '/auth/google/callback'
}, (request, accessToken, refreshToken, profile, done) => {
    
    let email = profile.email;
    let googleUser = {
      email: email,
      providers: [profile.provider],
      google: {
        name: profile.displayName,
        image: profile.photos[0].value,
      },
    };

    User.findOne({ email : profile.email }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        User.create(googleUser, (err, userData) => {
          if (err) return done(err);
          return done(null, userData);
        });
      }
      done(null, user);
    });
  }
))


passport.serializeUser((addUser, done) => {
    done(null, addUser.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });