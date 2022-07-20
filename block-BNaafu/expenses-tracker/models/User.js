let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: { type: String, },
 
  password: { type: String },
  age: { type: Number },
  phone: { type: Number },
  country: { type: String },
  IncomeId:{type:Schema.Types.ObjectId,ref:"Income"},
  ExpenseId:{type:Schema.Types.ObjectId,ref:"Expense"},
  email: { type: String, required: true, unique: true },
  github:{
name:String,
username:String,
image:String
  },
  google: {
    name:String,
    image:String
  },
  providers:["String"]
});

userSchema.pre('save', function (next) {
    if(this.password && this.isModified("password")){
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if(err) return next(err);
            this.password = hashed;
            return next();
          });
    }else{
        next()
    }
});

userSchema.methods.verifyPassword=function(password,cb){
bcrypt.compare(password,this.password, (err,result)=>{
    return cb(err,result);
})
}



module.exports = mongoose.model('User', userSchema);
