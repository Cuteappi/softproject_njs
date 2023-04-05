const Menuitem = require('../models/menuitems')

let cart=null

module.exports = class Cart {

    static save(product,amount) {

        if (cart === null) {
            cart = { products: [], totalprice:0 };
            cart.products.push(product);
            cart.totalprice = Cart.getTotalPrice();
            
        }else{
            var existingProductIndex = Cart.getIndex(product)// to check product is existing in cart
            if (existingProductIndex != -1) { 
                
                // exist in cart already
                var y=parseInt(cart.products[existingProductIndex][2])
                amount+=y;
                cart.products[existingProductIndex][2]=amount;

                cart.totalprice = Cart.getTotalPrice();

            }else{
                cart.products.push(product);
                cart.totalprice = Cart.getTotalPrice()
            }
        }

        //cart.totalPrice += product.price;
    }

    static getIndex(prod){
        for (var i=0; i<cart.products.length;i++){
            if(cart.products[i][1] === prod[1]){
                return i;
            }
        }
        return -1;
    }   

    static getTotalPrice(){
        var tp=0
        for (let i=0; i<cart.products.length; i++)
        {   
            var price=cart.products[i][0].price;

            var qtyprice= price * cart.products[i][2];
            tp += qtyprice;
        }
        return tp;
    }

    static changeqty(id,qty){
        for(var i=0;i<cart.products.length;i++){
            if(cart.products[i][1]== id){
                cart.products[i][2] =qty;
                cart.totalprice = Cart.getTotalPrice()
            }
        }
    }

    static getCart() {
        return cart;
    }

    static deleteItem(id){
        for(var i=0;i<cart.products.length;i++){
            if(cart.products[i][1]== id){
                cart.products.splice(i,1)
            }
        }
        cart.totalprice = Cart.getTotalPrice()
    }

    static deleteAll() {
        cart=null
        
    }

}
