const Product = require("../models/product");

exports.getAdminProducts = (req, res) => {
    Product.fetchAll().then(prods => {
        res.render('admin/admin-products', {
            prods: prods,
            pageTitle: 'Admin Products',
            active: "admin-products"
        });
    });
}

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        active: "add-product"
    });
};

exports.postAddProduct = (req, res) => {
    const price = Number(parseFloat(req.body.price).toFixed(2));
    const product = new Product(
        req.body.title,
        price,
        req.body.description.replace(/\n/g, "<br />"),
        req.body.imageURL,
        null,
        req.user._id
    );
    product.save().then(() => {
        res.redirect('/products');
    });
};

exports.getEditProduct = (req, res) => {
    Product.findById(req.params.prodID)
        .then(prod => {
            res.render("admin/edit-product", {
                pageTitle: "Edit: " + prod.title,
                prod: prod
            });
        });
}

exports.postEditProduct = (req, res) => {
    const price = Number(parseFloat(req.body.price).toFixed(2));
    const prod = new Product(
        req.body.title,
        price,
        req.body.description.replace(/\n/g, "<br />"),
        req.body.imageURL,
        req.body.id,
        req.user._id
    );
    prod.save().then(() => {
        res.redirect("/admin/products");
    });
}

exports.postDeleteProduct = (req, res) => {
    Product.deleteById(req.params.prodID)
        .then(() => {
            res.redirect("/admin/products")
        });
}