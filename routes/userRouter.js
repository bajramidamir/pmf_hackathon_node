const express = require('express');
const router = express.Router();
const cookie = require('cookie');

const userController = require('../controllers/userController');
const userModel = require('../models/userModel');
const reportController = require('../controllers/reportController');
const reportModel = require("../models/reportModel");


router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        res.render('userDashboard');
    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.post("/submit_report", ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        reportController.createReport(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
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
    if (req.user.role === 'user') {
        return next();
    };
    res.status(403).send('Permission denied');
};

module.exports = router;