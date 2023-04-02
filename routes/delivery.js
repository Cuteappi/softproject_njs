const express = require('express')
const customer = require('../models/customer')
const router=express.Router()

router.get('/',(req, res) => {
    if (req.session.authorized) {
    res.render('delivery/delivery.ejs')
    } else {
        res.redirect('/')
    }
})

module.exports = router