let User=require("../models/User");

module.exports={
    loggedInUser: (req,res,next)=>{
        console.log(req.session)
        if(req.session && req.session.userId){
            console.log(req.session)
            next()
        }else{
            res.redirect("/users/login")
        }
    },
    userInfo: (req,res,next)=>{
        let userId= req.session && req.session.userId;
        if(userId){
            User.findById(userId, "name email", (err,user)=>{
                if(err) return next(err);
                req.user=user;
                res.locals.user=user;
                next();
            })
        }else{
            req.user=null,
            req.locals.user=null
            next()
        }
    }
}