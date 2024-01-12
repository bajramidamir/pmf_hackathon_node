const bcrypt = require('bcrypt');
const cookie = require('cookie');
const userModel = require('../models/userModel');


const getHashedPassword = async (password) => {
    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.getUserByUsername(username);
        if (user) {
            bcrypt.compare(password, user.u_password, (err, result) => {
                if (result) {
                    const userCookie = cookie.serialize('user', JSON.stringify({
                        id: user.id,
                        username: user.username,
                        password: user.u_password,
                        role: user.roles,
                        mail: user.mail,
                        firstName: user.u_name,
                        surName: user.u_surname,
                    }));
                    res.setHeader('Set-Cookie', userCookie);

                    if (user.roles === 'admin') {
                        res.redirect('/admin_dashboard');
                    } else {
                        res.redirect('/user_dashboard');
                    }
                } else {
                    // Dodajte poruku u res.locals za prikaz u EJS fajlu
                    res.locals.errorMessage = 'Pogrešna šifra ili korisničko ime.';
                    res.render('loginSignup', { title: 'Infra Tracker - Login' });
                }
            });
        } else {
            // Dodajte poruku u res.locals za prikaz u EJS fajlu
            res.locals.errorMessage = 'Korisnik nije pronađen.';
            res.render('loginSignup', { title: 'Infra Tracker - Login' });
        }
    } catch (err) {
        console.error(err);
    }
};
const createUser = async (req, res) => {
    const { username, mail, password, firstName, lastName } = req.body;
    try {
        const userExists = await userModel.getUserByUsername(username);

        // Provera da li korisnik već postoji
        if (userExists) {
            res.render('registerSingup', { title: 'Infra Tracker - Register', errorMessage: 'Korisničko ime već postoji.' });
            return;
        }

        // Provera da li e-mail već postoji
        const emailExists = await userModel.getUserByEmail(mail);
        if (emailExists) {
            res.render('registerSingup', { title: 'Infra Tracker - Register', errorMessage: 'E-mail već postoji.' });
            return;
        }

        const hashedPassword = await getHashedPassword(password);
        await userModel.insertUser(username, mail, hashedPassword, firstName, lastName);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).render('registerSingup', { title: 'Infra Tracker - Register', errorMessage: 'Greška pri kreiranju korisnika.' });
    }
};

module.exports = {
    loginUser,
    createUser
};