let mongoose=require("mongoose");
let Schema=mongoose.Schema;


let expenseSchema=new Schema({
  category:{type:String,required:true},  
amount:{type:Number,required:true},
date:{type:Date},
userId:{type:Schema.Types.ObjectId, ref : "User" }
},{timestamps:true})

module.exports=mongoose.model("Expense",expenseSchema)