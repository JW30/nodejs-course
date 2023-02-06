const Product = require("../models/product");

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/admin-products', {
            prods: products,
            pageTitle: 'Admin Products',
            active: "admin-products"
        });
    });
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        active: "add-product"
    });
};

exports.postAddProduct = (req, res, next) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
    });
    const price = formatter.format(req.body.price);
    const product = new Product(req.body.title, req.body.description, price, req.body.image);
    product.save();
    res.redirect('/');
};