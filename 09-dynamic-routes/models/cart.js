const fs = require("fs");
const path = require("path");

const cartFile = path.join(path.dirname(process.mainModule.filename), "data", "cart.json");
const getCartProducts = (callback) => {
    fs.readFile(cartFile, (err, data) => {
        if (err) {
            callback([]);
        } else {
            callback(JSON.parse(data.toString()));
        }
    });
}

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(cartFile, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(fileContent.toString());
            }
            const existingProduct = cart.products.find(prod => prod.id === id);
            if (existingProduct) {
                existingProduct.qty += 1;
            } else {
                cart.products.push({id: id, qty: 1});
            }
            cart.totalPrice += productPrice;
            cart.totalPrice = Number((cart.totalPrice).toFixed(2));
            fs.writeFile(cartFile, JSON.stringify(cart), err => {
                console.log(err);
            })
        });
    }

    static reduceProduct(id, productPrice, erase) {
        fs.readFile(cartFile, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(fileContent.toString());
            }
            const prod = cart.products.find(prod => prod.id === id);
            if (!prod) return;
            if (erase || prod.qty === 1) {
                cart.products = cart.products.filter(p => p.id !== id);
                cart.totalPrice -= productPrice * prod.qty;
            } else {
                prod.qty -= 1;
                cart.totalPrice -= productPrice;
            }
            cart.totalPrice = Number((cart.totalPrice).toFixed(2));
            fs.writeFile(cartFile, JSON.stringify(cart), err => {
                console.log(err);
            })
        });
    }

    static fetchAll(callback) {
        getCartProducts(callback);
    }
}