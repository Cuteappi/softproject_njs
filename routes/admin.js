const express = require('express')
const Menuitem = require('../models/menuitems')
const path = require('path')
const router=express.Router()

const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']


//get into admin
router.get('/',async (req,res) =>{
    if (req.session.authorized) {
        console.log(req.session)
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
    } else {
        console.log(req.session)
        res.redirect('/')
    }
    
})

//get in addmenu
router.get('/addmenu',(req,res) =>{
    if (req.session.authorized) {
        res.render('admin/addmenu.ejs',{title: 'add to menu',name: global.name})
    
    } else {
        res.redirect('/')    
    }
    
})


//post addmenu
router.post('/addmenu',async (req,res) =>{
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

function saveimg(menuitem,imageEncoded){
    if(imageEncoded==null){return}
    const foodimage=JSON.parse(imageEncoded)
    if(foodimage !=null && imageMimeTypes.includes(foodimage.type)){
        menuitem.image = new Buffer.from(foodimage.data,'base64')
        menuitem.imagetype = foodimage.type
    }
}

module.exports = router