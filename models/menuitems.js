const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
    
    itemname: {
        type: String,
        required: true,
        unique: true
    },

    foodtype:{
        type: String,
        required: true,
        enum:['veg','nonveg']
    },

    shortdesp: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    image: {
        type: Buffer,
        required: true
    },

    imagetype: {
        type: String,
        required: true
    }
},{timestamps: true})

menuItemSchema.virtual('one').get(function() {
    if (this.image != null && this.imagetype != null) {
      return `data:${this.imagetype};charset=utf-8;base64,${this.image.toString('base64')}`
    }
  })

const menuitem = mongoose.model('menuitem', menuItemSchema);
module.exports = menuitem;