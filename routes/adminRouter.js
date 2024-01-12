const express = require('express');
const router = express.Router();
const cookie = require('cookie');

const userController = require('../controllers/userController');
const userModel = require('../models/userModel');


router.get('/', ensureAdmin, ensureAuthenticated, async (req, res) => {
    try {
        res.render('adminDashboard');
    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});


// helper functions 
function ensureAuthenticated(req, res, next) {
    const userCookie = req.cookies.user;
    if (userCookie) {
        req.user = JSON.parse(userCookie);
        return next();
    }
    res.status(401).send("Unauthorized");
};
function ensureAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        return next();
    };
    res.status(403).send('Permission denied');
};

module.exports = router;