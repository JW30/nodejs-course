const db = require("../util/database");

module.exports = class Product {
    constructor(title, price, description, imageURL) {
        this.id = null;
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageURL = imageURL;
    }

    save() {
        return db.query("INSERT INTO products (title, price, description, imageURL) " +
            "VALUES (?, ?, ?, ?);",
            [this.title, this.price, this.description, this.imageURL])
            .then(res => {
                this.id = res[0].insertId
            });
    }


    static deleteById(id) {
        return db.query("DELETE FROM products WHERE id = ?", [id]);
    }

    static updateById(id, title, price, description, imageURL) {
        return db.query("UPDATE products " +
            "SET title=?, price=?, description=?, imageURL=? " +
            "WHERE id=?", [title, price, description, imageURL, id]);
    }

    static getAll() {
        return db.execute("SELECT * FROM products");
    }


    static getById(id) {
        return db.query("SELECT * FROM products WHERE id = ?", [id]);
    }
}