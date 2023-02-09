const Product = require("../models/product");

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll((prods) => {
        res.render('admin/admin-products', {
            prods: prods,
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
    const product = new Product(null, req.body.title, req.body.description, parseFloat(req.body.price), req.body.image);
    product.save();
    res.redirect('/products');
};

exports.getEditProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.findById(prodID, (prod) => {
        res.render("admin/edit-product", {
            pageTitle: "Edit: " + prod.title,
            prod: prod
        });
    });
}

exports.postEditProduct = (req, res, next) => {
    Product.update(req.body.id,
        req.body.title,
        req.body.description,
        parseFloat(req.body.price),
        req.body.image
    );
    res.redirect("/admin/products");
}

exports.postDeleteProduct = (req, res, next) => {
    const prodID = req.params.prodID;
    Product.deleteById(prodID);
    res.redirect("/admin/products");
}