const jwt = require('jsonwebtoken');
const User = require('../nodejs/Database/models/users')
const secretKey = 'OdayIsNerd';
module.exports.checkAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, secretKey, (err, DToken) => {
            if(err) {
                res.redirect('/login');
            }else {
                next();
            }
        });
    }else {
        res.redirect('/login');
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, secretKey, (err, DToken) => {
            if(!err) {
                res.redirect('/home');
            }
        });
    }
    next();
}
