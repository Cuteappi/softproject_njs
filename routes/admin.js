const express = require('express')
const Menuitem = require('../models/menuitems')
const customer = require('../models/customer')
const Order = require('../models/order')
const Delivery = require('../models/delivery')
const path = require('path')
const router=express.Router()

const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']


//get into admin
router.get('/',async (req,res) =>{
    if (req.session.authorized) {
        if (req.session.user.admin=='yes'){

            try{
                let query = await Menuitem.find()
                res.render('admin/admin.ejs',{
                    title: 'admin page',
                    item: query,
                    name: global.name
                })
        
            }catch(err){
                res.redirect('/admin')
                console.log(err);
            }
        }else{
            res.redirect('/home')
        }
        
    } else {
        console.log(req.session)
        res.redirect('/')
    }
    
})

//get in addmenu
router.get('/addmenu',(req,res) =>{
    if (req.session.authorized) {
        if (req.session.user.admin=='yes'){

            res.render('admin/addmenu.ejs',{title: 'add to menu',name: global.name})
        }else{
            res.redirect('/home')
        }
    } else {
        res.redirect('/')    
    }
    
})


//post addmenu
router.post('/addmenu',async (req,res) =>{
    if (req.session.authorized) {
        var menuitem = new Menuitem({
            itemname: req.body.itemname,
            foodtype: req.body.foodtype,
            shortdesp: req.body.shortdesp,
            description: req.body.description,
            price:req.body.price
        })
        saveimg(menuitem ,req.body.itemimage)

        try{
            const newmenuitem = await menuitem.save()
            res.render('admin/addmenu.ejs',{title: 'add to menu',name: global.name})

        }catch(err){
            res.redirect('/admin')
            console.error(err)
            
        }
    } else {
        res.redirect('/')
    }
})


router.get('/admin-menu-del-update/:id', async (req, res) =>{
    if (req.session.authorized) {
        try{
            var menuitem = await Menuitem.findById(req.params.id)
            res.render('admin/admin-menu-del-update.ejs',{
                title: `edit ${menuitem.itemname} page`,
                item: menuitem,
                name: global.name
            })

        }catch(err){
            res.render('admin/admin.ejs',{title: 'add to menu',name: global.name})
        }
    } else {
        res.redirect('/')
    }
})

router.put('/admin-menu-del-update/:id', async (req, res) =>{
        let menuitem
        try{
            menuitem = await Menuitem.findById(req.params.id)
            if(req.body.itemname != null && req.body.itemname !=''){menuitem.itemname = req.body.itemname}
            if(req.body.foodtype != null && req.body.foodtype !=''){menuitem.foodtype = req.body.foodtype}
            if(req.body.shortdesp != null && req.body.shortdesp !=''){menuitem.shortdesp = req.body.shortdesp}
            if(req.body.description != null && req.body.description !=''){menuitem.description = req.body.description}
            if(req.body.price != null && req.body.price !=''){menuitem.price = req.body.price}
            if(req.body.itemimage != null && req.body.itemimage !=''){saveimg(menuitem ,req.body.itemimage)}
            
            await menuitem.save()
            res.render('admin/admin-menu-del-update.ejs',{
                title: `edit ${menuitem.itemname} page`,
                item: menuitem,
                name: global.name
            })

        }catch(err){
            console.log(err)
            res.redirect('/admin')
        }

})

router.delete('/admin-menu-del-update/:id', async (req, res) =>{
    let menuitem
    try{
        menuitem = await Menuitem.findById(req.params.id)
        await menuitem.deleteOne()
        res.redirect('/admin')
    }catch(err){
        console.log(err)
        res.redirect('/admin')
    }

})

//get deliverers
router.get('/deliverers', async (req, res) =>{
    if (req.session.authorized) {
        try{
            var deliverers = await Delivery.find()
            res.render('admin/deliverers.ejs',{
                title: `deliverers page`,
                item: deliverers,
                name: global.name
            })

        }catch(err){
            res.render('admin/admin.ejs',{title: 'add to menu',name: global.name})
        }
    } else {
        res.redirect('/')
    }
})

//add deliverers
router.post('/deliverers',async (req,res) =>{
    if (req.session.authorized) {
        var deliverer = new Delivery({

            deliverer_name: req.body.name,
            Phone_number: req.body.pnum, 
        })

        try{
            const x= await deliverer.save()
            res.redirect('/admin/deliverers')

        }catch(err){
            res.redirect('/admin')
            console.error(err)
            
        }
    } else {
        res.redirect('/')
    }
})


//get orders
router.get('/allorders', async (req, res) =>{
    if (req.session.authorized) {
        try{

            var orders = await Order.find()
            var cust = await customer.find()
            var menu = await Menuitem.find()
            var deliverer = await Delivery.find()

            res.render('admin/allorders.ejs',{
                title: `Order`,
                item: orders,
                customers: cust,
                menuitems: menu,
                del : deliverer,
                name: global.name
            })

        }catch(err){
            res.render('admin/admin.ejs',{title: 'add to menu',name: global.name})
        }
    } else {
        res.redirect('/')
    }
})

function saveimg(menuitem,imageEncoded){
    if(imageEncoded==null){return}
    const foodimage=JSON.parse(imageEncoded)
    if(foodimage !=null && imageMimeTypes.includes(foodimage.type)){
        menuitem.image = new Buffer.from(foodimage.data,'base64')
        menuitem.imagetype = foodimage.type
    }
}

module.exports = router