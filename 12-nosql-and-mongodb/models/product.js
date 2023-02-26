const {ObjectId} = require('mongodb');

const getDb = require("../util/database").getDb;

class Product {
    constructor(title, price, description, imageURL, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageURL = imageURL;
        this._id = id ? new ObjectId(id) : id;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        if (this._id) {
            return db.collection("products").updateOne(
                {_id: this._id},
                {$set: this}
            );
        } else {
            return db.collection("products").insertOne(this);
        }
    }

    update() {
        const db = getDb();
        return db.collection("products")
            .updateOne(
                {_id: this._id},
                {$set: this}
            );
    }

    static fetchAll(options = {}) {
        const db = getDb();
        return db.collection("products").find(options).toArray();
    }

    static findById(id, options = {}) {
        const db = getDb();
        return db.collection("products").findOne({_id: new ObjectId(id), ...options});
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection("products").deleteOne({_id: new ObjectId(id)});
    }
}

module.exports = Product;