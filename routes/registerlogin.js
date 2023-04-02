const express = require('express')
const router=express.Router()

//register-sign up route

router.get('/',(req,res) =>{
    res.render('registerlogin/registered')
})

module.exports = router