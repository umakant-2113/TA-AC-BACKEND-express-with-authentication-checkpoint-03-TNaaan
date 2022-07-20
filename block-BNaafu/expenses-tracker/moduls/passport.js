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
  function(accessToken, refreshToken, profile, cb) {
    let email=profile._json.email;
    let githubUser={
     email:email,
     provides:[profile.provide],
     github:{
        name:profile.displayName,
        username:profile.username,
        image:profile._json.avatar_url
     }
    }
    User.findOne({email},(err,user)=>{
        if(err) return cb(err);
        if(!user){
            User.create(githubUser,(err,creatuser)=>{
                if(err) return  cb(err,false)
                cb(null,user)
            })
        }
    })

    
  }
));

// login with google

passport.use(new GoogleStrategy({
    clientID: process.env.google_client_id,
    clientSecret: process.env.google_client_secret,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshTOken, profile, done) => {

    User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err)

        if (!user) {
            return done(null, false)
        }
        done(null, user)
    })
}))




passport.serializeUser((user, done) => {
    return done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(null, user)
    })
})