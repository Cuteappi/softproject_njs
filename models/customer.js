const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    
    username: {
        type: String,
        required: true,
        unique: true

    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    phonenumber: {
        type: Number,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    admin:{
        type: String,
        required: true,
        default: 'no',
        enum:['yes','no']
    }
},{timestamps: true})

const customer = mongoose.model('customer', customerSchema);
module.exports = customer;
