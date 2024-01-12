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
        console.log(user);
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
                    };
                };
            });
        };
    } catch (err) {
        console.error(err);
    };
};

const createUser = async (req, res) => {
    const { username, mail, password, firstName, lastName } = req.body;
    try {
        const hashedPassword = await getHashedPassword(password);
        await userModel.insertUser(username, mail, hashedPassword, firstName, lastName);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    };
};

module.exports = {
    loginUser,
    createUser
};