const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({

    order:[],

    customer_id:{
        type: string,
        required:true
    }

})

const order = mongoose.model('order', orderSchema);
module.exports = order;