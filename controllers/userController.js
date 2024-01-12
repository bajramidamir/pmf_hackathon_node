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
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const userCookie = cookie.serialize('user', JSON.stringify({
                        id: user.user_id,
                        username: user.username,
                        role: user.role,
                        firstName: user.first_name,
                        lastName: user.last_name,
                    }));

                    res.setHeader('Set-Cookie', userCookie);

                    if (user.role === 'admin') {
                        res.redirect('/admin_dashboard');
                    } else if (user.role === 'employee') {
                        res.redirect('/employee_dashboard');
                    } else if (user.role === 'project manager') {
                        res.redirect('/project_manager_dashboard');
                    }
                };
            });
        };
    } catch (err) {
        console.error(err);
    };
};

const createUser = async (req, res) => {
    const { username, password, firstName, lastName, role } = req.body;
    try {
        const hashedPassword = await getHashedPassword(password);
        await userModel.insertUser(username, hashedPassword, role, firstName, lastName);
        res.redirect('/admin_dashboard/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
};

module.exports = {
    loginUser,
    createUser
}