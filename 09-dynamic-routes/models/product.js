const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const dataFile = path.join(path.dirname(process.mainModule.filename), "data", "products.json");
const getProductsFromFile = (callback) => {
    fs.readFile(dataFile, (err, data) => {
        if (err) {
            callback([]);
        } else {
            callback(JSON.parse(data.toString()));
        }
    });
}

module.exports = class Product {
    constructor(id, title, description, price, image) {
        this.title = title;
        this.price = price;
        this.image = image;
        this.description = description;
    }

    save() {
        getProductsFromFile((products) => {
            this.id = String(Product.getId(products)).padStart(8, "0");
            products.push(this);
            fs.writeFile(dataFile, JSON.stringify(products), (err) => {
                console.log("Save error: " + err);
            });
        });
    }

    static update(id, title, description, price, image) {
        getProductsFromFile((products) => {
            const product = products.find(p => p.id === id);
            product.title = title;
            product.description = description;
            product.price = price;
            product.image = image;
            fs.writeFile(dataFile, JSON.stringify(products), (err) => {
                console.log("Update error: " + err);
            });
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static getId(products) {
        let last = 0;
        for (const prod of products) {
            const curr = parseInt(prod.id);
            if (curr - last > 1) {
                return last + 1;
            }
            last = curr;
        }
        return last + 1;
    }

    static findById(id, callback) {
        getProductsFromFile(products => {
           const product = products.find(p => p.id === id);
           callback(product);
        });
    }

    static deleteById(id) {
        getProductsFromFile((products) => {
            const prod = products.find(p => p.id === id);
            products = products.filter(p => p.id !== id);
            fs.writeFile(dataFile, JSON.stringify(products), (err) => {
                if (!err) {
                    Cart.reduceProduct(id, prod.price, true);
                }
                console.log("Delete error: " + err);
            });
        });
    }
}