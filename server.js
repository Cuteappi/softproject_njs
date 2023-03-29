if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//global variables
global.name=''

//importing modules
const express = require('express')
const path=require('path')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyparser = require('body-parser')
const methodOverride = require('method-override')


//router initalization  
const indexrouter = require('./routes/index')
const registerloginrouter = require('./routes/registerlogin')
const adminrouter = require('./routes/admin')
const homerouter = require('./routes/home')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(methodOverride('_method'))
app.use(expressLayouts)
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyparser.urlencoded({limit:'10mb',extended:false}))


//database connection
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true})

const db = mongoose.connection
db.on('error',error =>console.log(error))
db.once('open',() =>console.log('connection achieved'))


//using routers
app.use('/',indexrouter)
app.use('/registerlogin',registerloginrouter)
app.use('/home',homerouter)
app.use('/admin',adminrouter)



//putting server on port
app.listen(process.env.PORT || 3000)