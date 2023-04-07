const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({

    order:[],

    customer_id:{
        type: String,
        required:true
    },

    dPerson_id:{
        type: String,
        required:true
    },

    expiry:{
        type: String,
        required:true,
        enum:['expired','not expired'],
        default:'not expired'
    }

},

{timestamps: true})

const order = mongoose.model('order', orderSchema);
module.exports = order;