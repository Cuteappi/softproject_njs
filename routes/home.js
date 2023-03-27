const express = require('express')

const router=express.Router()

//register-sign up route

router.get('/',(req,res) =>{
    res.render('home/home.ejs',{title: 'Home'})
}) 

module.exports = router