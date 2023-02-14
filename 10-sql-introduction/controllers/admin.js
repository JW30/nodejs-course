const Product = require("../models/product");

exports.getAdminProducts = (req, res, next) => {
    Product.getAll().then(([rows, fieldData]) => {
        res.render('admin/admin-products', {
            prods: rows,
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
    const price = Number(parseFloat(req.body.price).toFixed(2));
    const product = new Product(req.body.title,
        price,
        req.body.description.replace(/\n/g, "<br />"),
        req.body.imageURL);
    product.save().then(() => {
        res.redirect('/products');
    });
};

exports.getEditProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.getById(prodID).then(result => {
        const prod = result[0][0];
        res.render("admin/edit-product", {
            pageTitle: "Edit: " + prod.title,
            prod: prod
        });
    });
}

exports.postEditProduct = (req, res, next) => {
    const price = Number(parseFloat(req.body.price).toFixed(2));
    Product.updateById(req.body.id,
        req.body.title,
        price,
        req.body.descriptionreq.body.description.replace(/\n/g, "<br />"),
        req.body.imageURL)
        .then(() => {
            res.redirect("/admin/products");
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.deleteById(prodID).then(() => {
        res.redirect("/admin/products");
    });
}