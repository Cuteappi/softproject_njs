const express = require('express')
const Razorpay = require('razorpay')
const Menuitem = require('../models/menuitems')
const Cart = require('../models/cart')
const Order = require('../models/order')
const Delivery = require('../models/delivery')
const path = require('path')
const router=express.Router()

//displays the home page
router.get('/', async(req,res) =>{
    if (req.session.authorized) {

        try{
            let query = await Menuitem.find().limit(5)
            res.render('home/home.ejs',{title: 'Home',
            item:query})
        }catch(err){
            res.redirect('/home')
            console.log(err);
        }
        
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

        if(req.session.haveOrder) {
            
            res.redirect('/home/delivery')
        }else{

            try{
                const y = await Menuitem.findById(req.params.id)
                var q=[y, req.params.id, parseInt(req.body.qty)]
                Cart.save(q,parseInt(req.body.qty))
                res.redirect('/home/homemenu')

            }catch(err){
                
                res.redirect('/home')
                console.log(err);
            }
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
        if(y!=null && y!=''){
            var options = {
                amount: parseInt(y.totalprice)*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "order_rcptid_11"
            };
            
            instance.orders.create(options, function(err, order) {
                res.json(order)
            });
        }
                    
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

        }else if (inputValue == "Remove"){
            Cart.deleteItem(req.params.id)
            var x= Cart.getCart()
            if(x.products.length == 0) {
                Cart.deleteAll()
            }
        }

        res.redirect('/home/cart')

    } else {
        res.redirect('/')
    }
})

//delivery page

router.get('/delivery', async (req, res) => {
    if (req.session.authorized) {

        try {
            // check if food has been delivered
            var order = await Order.findOne({customer_id : req.session.user._id, expiry: 'not expired'})
            
            if(order != null && order!=''){

                // server side counter
                var countdown = order.createdAt.getTime() + 45 * 60000;
                var now = new Date().getTime();
                var distance = countdown - now;

                // check if customer order has been delivered
                if( order.customer_id == req.session.user._id && order.expiry == 'not expired' && distance > 0 ){

                    req.session.haveOrder = true;

                    req.session.save((err) => {
                        if (err) {
                            return next(err);
                        }
                    })

                    //get order details and delivere
                    const deliverer = await Delivery.findOne({_id : order.dPerson_id})

                    res.render('home/delivery.ejs',{
                        timer : order.createdAt.getTime(),
                        Deliverer : deliverer
                    })

                }else{
                    //sets order and then removes one from delivery
                    order.expiry = 'expired'

                    const deliverer = await Delivery.findOne({_id : order.dPerson_id})
                    if(deliverer.numberOrders > 0){

                        if(deliverer.numberOrders == 5){

                            deliverer.numberOrders = deliverer.numberOrders - 1 
                            deliverer.occupied='no'
                            await deliverer.save()

                        }else{
                            deliverer.numberOrders = deliverer.numberOrders - 1 
                            await deliverer.save()
                        }
                    }
                    
                    await order.save()
                    req.session.haveOrder = false;

                    req.session.save((err) => {
                        if (err) {
                            return next(err);
                        }
                    })

                    res.render('home/delivery.ejs',{
                        timer: null,
                        Deliverer : null
                    })
                }
            }else{
                res.render('home/delivery.ejs',{
                    timer: null,
                    Deliverer : null
                })
            }
            
        }catch(err){
            res.render('home/delivery.ejs',{
                timer: null,
                Deliverer : null
            })
            
            console.log(err)
        }

        

    } else {
        res.redirect('/')
    }
})



router.post('/delivery', async (req, res) => {
    if (req.session.authorized) {

        var paydoc = await instance.payments.fetch(req.body.razorpay_payment_id)
        
        if(paydoc.status == 'captured'){
            
            
            var x=Cart.getCart()
            try{

                var dperson = await Delivery.findOne({occupied:'no'}).limit(1)

                if(dperson.numberOrders <=4){
                    dperson.numberOrders = dperson.numberOrders + 1 
                    if (dperson.numberOrders == 5){
                        dperson.occupied = 'yes'

                    }
                }

                var newOrder = new Order({
                    customer_id: req.session.user._id,
                    dPerson_id: dperson._id
                })
    
                for(var i=0;i<x.products.length;i++){
    
                    var q = [x.products[i][1], x.products[i][2]]
                    newOrder.order.push(q)
                }

                await dperson.save()

                await newOrder.save()
    
                Cart.deleteAll()
                res.redirect('/home/delivery')
                
            }catch(e){
                dperson.numberOrders = dperson.numberOrders - 1 
                await dperson.save()
                console.log(e)
            }
        }

    } else {
        res.redirect('/')
    }
})

module.exports = router