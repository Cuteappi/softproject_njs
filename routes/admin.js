const express = require('express')
const Menuitem = require('../models/menuitems')
const path = require('path')
const router=express.Router()

const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']


//get into admin
router.get('/',async (req,res) =>{
    try{
        let query = await Menuitem.find()
        res.render('admin/admin.ejs',{
        title: 'admin page',
        item: query,
        name: global.name
        
    })

    }catch(err){
        res.render('admin/addmenu.ejs')
        console.log(err);
    }
    
})

//get in addmenu
router.get('/addmenu',(req,res) =>{
    res.render('admin/addmenu.ejs',{title: 'add to menu',name: global.name})
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
        res.render('admin/admin.ejs',{title: 'add to menu',name: global.name})
        console.error(err)
        
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