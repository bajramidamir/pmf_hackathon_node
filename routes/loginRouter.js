const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.get('/', (req, res) => {
    res.render('loginSignup');
});

router.get('/register', (req, res) => {
    res.render('registerSingup');
})

router.post('/login', userController.loginUser)
router.post('/register', userController.createUser);

module.exports = router;