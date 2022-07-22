let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let incomeSchema=new Schema({
source:{type:String,required:true},
 amount:{type:Number},
 date:{type:Date},
 userId:{type:Schema.Types.ObjectId,ref:"User"} 
},{timestamps:true})

module.exports=mongoose.model("Income",incomeSchema);
