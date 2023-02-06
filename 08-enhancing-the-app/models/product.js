const fs = require("fs");
const path = require("path");

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
    constructor(title, description, price, image) {
        this.title = title;
        this.price = price;
        this.image = image;
        this.description = description;
    }

    save() {
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(dataFile, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }
}