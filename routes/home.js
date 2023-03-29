const express = require('express')
const Menuitem = require('../models/menuitems')
const path = require('path')
const router=express.Router()

//register-sign up route

router.get('/',(req,res) =>{
    res.render('home/home.ejs',{title: 'Home'})
})

router.get('/homemenu',async (req,res) =>{
    try{
        let query = await Menuitem.find()
        res.render('home/homemenu.ejs',{
        title: 'Menu page',
        item: query,
        name: global.name
        
    })

    }catch(err){
        res.render('admin/addmenu.ejs')
        console.log(err);
    }
    
})

module.exports = router