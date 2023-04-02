const express = require('express')
const Razorpay = require('razorpay')
const Menuitem = require('../models/menuitems')
const Cart = require('../models/cart');
const path = require('path')
const router=express.Router()

//displays the home page
router.get('/',(req,res) =>{
    if (req.session.authorized) {
        res.render('home/home.ejs',{title: 'Home'})
    } else {
        res.redirect('/')
    }
})

//display the home menu
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

//get page where we add order
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

//add order
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


//creating instance

const instance = new Razorpay({
    key_id: 'rzp_test_KLPuQguE2HdrjK',
    key_secret: '2YzfukuuhfudMhr3e8ER0f7E',
});


//go to payment page
router.post('/cart', (req,res) =>{
    if (req.session.authorized) {

        var y= Cart.getCart()

        var options = {
            amount: parseInt(y.totalprice)*100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
        };
        
        instance.orders.create(options, function(err, order) {
            console.log(order)
            res.json(order)
        });
        
            
    } else {
        res.redirect('/')
    }
})


//get item info in cart
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


// editor remove item from cart  
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

//delivery page

router.get('/delivery',(req, res) => {
    if (req.session.authorized) {

    res.render('home/delivery.ejs')

    } else {
        res.redirect('/')
    }
})

router.post('/delivery',(req, res) => {
    if (req.session.authorized) {

        instance.payments.fetch(req.body.razorpay_payment_id).then((paydoc) => {
            if(paydoc.status == 'captured'){
                res.redirect('/home/delivery')
                Cart.deleteAll()
            }
        })
    } else {
        res.redirect('/')
    }
})

module.exports = router