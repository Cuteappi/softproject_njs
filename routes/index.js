const express = require('express')
const customer = require('../models/customer')
const bcrypt = require('bcrypt')
const router=express.Router()

router.get('/',(req,res) =>{
    if (req.session.authorized==true && req.session.user.admin=='yes') {
        res.redirect('/admin');

    }else if (req.session.authorized==true && req.session.user.admin=='no'){
        res.redirect('/home')

    }else{
        res.render('index',{title:"login-signup"})
    }

    
})  



router.post('/', async (req,res,) =>{
    var inputValue = req.body.submit;

    if (inputValue == "log-in") {
        if (req.body.Username && req.body.Pass) {
        
            var username = req.body.Username
            var password = req.body.Pass
        
            try{             
                let user = await customer.findOne({username})

                if (user) {
                    const auth = await bcrypt.compare(password,user.password)
                    if (auth){

                        req.session.user = user;
                        req.session.authorized = true;
                        global.name=username
                        if (user.admin=='yes'){
                            res.redirect('/admin');
                        }else{
                            res.redirect('/home')
                        }
                    }else{
                        res.render('index',{title:"login-signup", error:"Invalid password"})
                    }
                }
                else {
                    res.render('index',{title:"login-signup", error:"Invalid Username"})
                }
            }catch(err){
                res.render('index',{title:"login-signup", error:"Invalid Username"})
                console.log(err);
            }
        }       
    }

    if (inputValue == "sign-up") {
        const values = new customer({
            username: req.body.Username,
            email: req.body.email,
            phonenumber: req.body.pnum,
            password: req.body.Pass
        });
        try{
            await values.save()
            req.session.user = values;
            req.session.authorized = true;
            global.name=values.username;
            res.redirect('/registerlogin')
        }catch(err){
            res.render('index',{title:"login-signup", error:"Something went wrong"})
            console.log(err)
        };
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router