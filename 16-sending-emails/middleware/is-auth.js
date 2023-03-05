module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.status(404).render('404', {
            pageTitle: 'Page Not Found',
            isLoggedIn: req.session.isLoggedIn
        });
    } else {
        next();
    }
}