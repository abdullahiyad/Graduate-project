const jwt = require('jsonwebtoken');
const User = require('../nodejs/Database/models/users')

module.exports.checkAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, 'OdayIsNerd', (err, DToken) => {
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
        jwt.verify(token, 'OdayIsNerd', (err, DToken) => {
            if(!err) {
                res.redirect('/home');
            }
        });
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        
    }
}

