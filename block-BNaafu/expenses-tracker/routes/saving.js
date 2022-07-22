let express = require('express');
let router = express.Router();
let Income = require('../models/Income');
let Expense = require('../models/Expense');
let User = require('../models/User');
let { format } = require('date-fns');

router.get('/income/new', (req, res, next) => {
  // console.log(req.session,"session ");
  // console.log(req.user ,"user data ")
  res.render('incomeForm');
});

router.post('/income/new', (req, res, next) => {
  let userId = req.user.id;

  Income.create(req.body, (err, income) => {
    User.findByIdAndUpdate(
      userId,
      { $push: { IncomeId: income.id } },
      (err, user) => {
        if (err) return next(err);
        res.redirect('/savings/details');
      }
    );
  });
});

router.get('/expense/new', (req, res, next) => {
  res.render('expanss');
});

router.post('/expense/new', (req, res, next) => {
  let userid = req.user.id;
  Expense.create(req.body, (err, expense) => {
    User.findByIdAndUpdate(
      userid,
      { $push: { ExpenseId: expense.id } },
      (err, user) => {
        if (err) return next(err);
        res.redirect('/savings/details');
      }
    );
  });
});

// details page

router.get('/details', async (req, res, next) => {
  try {
    
  
  let date = new Date()
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  let data = []
  let source =[];
  let category=[]
  let sumEx=0;
  let sumIn=0;
  
    let allIncome =await Income.find({}) 
  let allExpanse = await Expense.find({})
 data=data.concat(allExpanse,allIncome)
 let forCurrent=[...data]

 for(let elm of data){
  if(elm.source){
   source.includes(elm.source)?"":source.push(elm.source)
  }else{
    category.includes(elm.category)?"":category.push(elm.category)
  }
 }
 if(req.query.source){
  data = await data.filter(elm=> elm.source===req.query.source)
 }else if(req.query.category){
  data = await data.filter(elm=> elm.category===req.query.category)
 }else if(req.query.startDate||req.query.endDate){
  data = await data.filter(elm=> console.log(elm.date>req.query.startDate))
 }

 forCurrent= await forCurrent.filter(elm=> elm.date>firstDay)
 for(let elm of forCurrent){
  if(elm.source){
    sumIn+=elm.amount
  }else {
    sumEx +=elm.amount
  }
 }
 let sortedData=data.sort((a,b)=> a.createdAt-b.createdAt)
 console.log(sortedData,sumIn,sumEx,source,category,format)
 res.render("details.ejs",{sortedData,sumIn,sumEx,source,category,format})
  
} catch (error) {
  
}

})

module.exports = router;
