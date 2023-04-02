const express = require('express')
const Menuitem = require('../models/menuitems')
const Cart = require('../models/cart');
const path = require('path')
const router=express.Router()

//register-sign up route
router.get('/',(req,res) =>{
    if (req.session.authorized) {
        res.render('home/home.ejs',{title: 'Home'})
    } else {
        res.redirect('/')
    }
})

router.get('/homemenu',async (req,res) =>{
    if (req.session.authorized) {
        try{
            let query = await Menuitem.find()
            res.render('home/homemenu.ejs',{
            title: 'Menu page',
            item: query,
            name: global.name
            })

        }catch(err){
            res.redirect('/home')
            console.log(err);
        }
    } else {
        res.redirect('/')
    }
})

router.get('/addorder/:id',async (req,res) =>{
    if (req.session.authorized) {
        try{
            let query = await Menuitem.findById(req.params.id)
            res.render('home/addorder.ejs',{
            title: 'Add Order page',
            item: query,
            name: global.name,
            })

        }catch(err){
            res.redirect('/home')
            console.log(err);
        }

    } else {
        res.redirect('/')
    }  
})

router.post('/addorder/:id',async (req,res) =>{
    if (req.session.authorized) {

        try{
            const y = await Menuitem.findById(req.params.id)
            var q=[y, req.params.id, parseInt(req.body.qty)]
            Cart.save(q,parseInt(req.body.qty))
            res.redirect('/home/homemenu')

        }catch(err){
            
            res.redirect('/home')
            console.log(err);
        }

    } else {
        res.redirect('/')
    }  
})

//displays cart
router.get('/cart', (req,res) =>{
    if (req.session.authorized) {

        res.render('home/cart.ejs',{
            title: 'Add Order page',
            cart: Cart.getCart(),
            name: global.name,
        })            
            
    } else {
        res.redirect('/')
    }
})

router.get('/cart/:id',async (req,res) =>{
    if (req.session.authorized) {

        var cartitems = Cart.getCart();
        var x;
        for (var i=0; i<cartitems.products.length; i++){
            if(cartitems.products[i][1] == req.params.id){
                x=i;
                break;
            }
        }
        res.render('home/edit.ejs',{
            title: 'edit'+ req.params.id+' page',
            item: cartitems.products[x],
            name: global.name,
        })

    } else {
        res.redirect('/')
    }
})

router.post('/cart/:id',async (req,res) =>{
    if (req.session.authorized) {

        var inputValue = req.body.submit;
        if (inputValue == "Edit"){
            Cart.changeqty(req.params.id, parseInt(req.body.qty))
            console.log(Cart.getCart())

        }else if (inputValue == "Remove"){
            Cart.deleteItem(req.params.id)
        }


        res.redirect('/home/cart')

    } else {
        res.redirect('/')
    }
})

module.exports = router