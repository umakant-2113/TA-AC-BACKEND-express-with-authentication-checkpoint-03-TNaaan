var express = require('express');
var router = express.Router();

let User=require("../models/User")
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(process.env. google_client_id);
  res.send('respond with a resource');
});


router.get("/register",(req,res,next)=>{
  res.render("register")
})

router.post("/register",(req,res,next)=>{
User.create(req.body,(err,user)=>{
  if(err) return next(err);
  res.redirect("/users/login")
})
})

// login page render
router.get("/login", (req,res,next)=>{
res.render("login")
})

// capture data

router.post("/login",(req,res,next)=>{
  let {email,password}=req.body;
  if(!email && !password){
    return res.redirect("/users/login")
  }
  User.findOne({email},(err,user)=>{
    if(err) return next(err);
    if(!user){
      return res.redirect("/users/login")
    }
    user.verifyPassword(password,(err,result)=>{
      if(err) return next(err);
      if(!result){
        return res.redirect("/users/login")
      } 
    req.session.userId=user.id;
    console.log(req.session.userId)
    res.redirect("/savings/details")
    })
  })
})

// logout 

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
})

// login with github







module.exports = router;
