const express = require('express');
const router = express.Router();
const cookie = require('cookie');

const userController = require('../controllers/userController');
const userModel = require('../models/userModel');
const reportController = require('../controllers/reportController');
const reportModel = require("../models/reportModel");
const nodemailer = require("nodemailer");

router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
    const reports = await reportModel.getAllReports();
    try {
        res.render('adminDashboard', { reports });
    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.get('/view_report', ensureAuthenticated, ensureAdmin, async (req, res) => {
    const { reportId } = req.query;
    const report = await reportModel.getReportById(reportId);
    try {
        res.render("adminViewReport", { report });
    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
});

router.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
});

router.post('/send-comment', ensureAuthenticated, ensureAdmin, async (req, res) => {
    console.log('Primljen POST zahtjev na /admin/send-comment');
    const { selectedStatus, comments, report_id, user_id } = req.body;
    console.log(user_id);

    try {
        // Prikupite e-poštu korisnika iz baze podataka
        const user = await userModel.getUserById(user_id);
        const userEmail = users.mail;
        console.log(userEmail);
        // Konfiguracija nodemailer transportera
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'hackaton2024@outlook.com', // Unesite vašu e-poštu
                pass: 'Hackaton' // Unesite vašu lozinku
            }
        });

        // Postavite opcije e-pošte
        const mailOptions = {
            from: 'hackaton2024@outlook.com',
            to: userEmail,
            subject: `Komentari za prijavu broj ${report_id}`,
            text: `Status: ${selectedStatus}\n\nKomentari:\n${comments}`
        };

        // Pošaljite e-poštu
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).send("Greška pri slanju e-pošte");
            } else {
                console.log('Email poslat: ' + info.response);
                res.redirect('/admin_dashboard'); // Promenite preusmeravanje prema vašim potrebama
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
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