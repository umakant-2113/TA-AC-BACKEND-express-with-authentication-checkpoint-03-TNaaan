let express = require('express');
let router = express.Router();
let Income = require('../models/Income');
let Expense = require('../models/Expense');
let User=require("../models/User")
let { format } = require('date-fns');

router.get('/income/new', (req, res, next) => {
  res.render('incomeForm');
});

router.post('/income/new', (req, res, next) => {
let userId=req.user.id;
  Income.create(req.body, (err, income) => {
User.findByIdAndUpdate(userId,{$push:{ IncomeId:income.id}},(err,user)=>{
  if (err) return next(err);
  res.redirect('/savings/details');
})
  });
});



router.get('/expense/new', (req, res, next) => {
  res.render('expanss');
});

router.post('/expense/new', (req, res, next) => {
  let userid=req.user.id;
  Expense.create(req.body, (err, expense) => {
    User.findByIdAndUpdate(userid,{$push:{ExpenseId:expense.id}},(err,user)=>{
      if (err) return next(err);
      res.redirect('/savings/details');
    })
   
  });
});



// details page

router.get('/details', (req, res, next) => {
  let arrIncome = [];
  let arrExpense = [];
  let sumEx = 0;
  let sumIn = 0;

  Income.find({}, (err, incomes) => {
    if (err) return next(err);
    Expense.find({}, (err, expense) => {
      if (err) return next(err);
      Income.distinct('source', (err, income) => {
        if (err) return next(err);
        Expense.distinct('category', (err, expans) => {
          if (err) return next(err);

          let data = incomes.concat(expense);

          let month = req.query.month;

          if (req.query.month) {
            let fulldata = data.filter((elm) => {
              let d1 = String(format(elm.date, 'yyyy-MM-dd'));
              let d2 = String(month);
              if (elm.category) {
                sumEx += elm.amount;
              }
              if (elm.source) {
                sumIn += elm.amount;
              }
              return d1.includes(d2);
            });
            return res.render('details', {
              sumIn,
              sumEx,
              fulldata,
              format,
              income,
              expans,
            });
          }

          if (req.query.income) {
            let fulldata = data.filter(
              (elm) => elm.source === req.query.income
            );
            res.render('details', {
              sumIn,
              sumEx,
              fulldata,
              format,
              income,
              expans,
            });
          }

          if (req.query.expens) {
            let fulldata = data.filter(
              (elm) => elm.category === req.query.expens
            );
            res.render('details', {
              sumIn,
              sumEx,
              fulldata,
              format,
              income,
              expans,
            });
          }


          let fulldata = data.sort((a, b) => a.createdAt - b.createdAt);
          fulldata.filter((elm) => {
            if (elm.category) {
              sumEx += elm.amount;
            } else {
              sumIn += elm.amount;
            }
          });
          res.render('details', {
            sumIn,
            sumEx,
            fulldata,
            format,
            income,
            expans,
          });
        });
      });
    });
  });
});

module.exports = router;
