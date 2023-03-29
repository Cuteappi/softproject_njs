const express = require('express')

const customer = require('../models/customer')

const router=express.Router()

router.get('/',(req,res) =>{
    res.render('index',{title:"login-signup"})
})  



router.post('/',(req,res) =>{
    var inputValue = req.body.submit;

    if (inputValue == "log-in") {
        
        let uname = req.body.Username;
        let password = req.body.Pass;
        customer.findOne({username:uname})
            .then(response =>{
                if(response.password == password) {
                    if (response.admin=='yes'){
                        res.redirect('/admin')
                        global.name = uname;
                        
                    }else{
                        res.redirect('/home')
                    }
                }else{
                    res.render('index',{title:"login-signup", error:"Invalid Password"})
                }
            })
            .catch(err =>{
                res.render('index',{title:"login-signup", error:"Invalid Username"})
                console.log(err);
            })

        
    }
    if (inputValue == "sign-up") {

        const values = new customer({
            username: req.body.Username,
            email: req.body.email,
            phonenumber: req.body.pnum,
            password: req.body.Pass
        });

        values.save()
            .then(() =>{
                res.redirect('/registerlogin')
            })
            .catch(err =>{
                console.log(err)
            });
    }
}) 

module.exports = router