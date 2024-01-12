const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session'); 

// routes
const loginRouter = require('./routes/loginRouter');
const adminRouter = require('./routes/adminRouter');

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret1512',
    resave: false,
    saveUninitialized: true,
}));
app.use(cookieParser());
app.use(ejsLayouts);
app.set('layout', false);

// view engine
app.set('view engine', 'ejs');




app.use('/', loginRouter);
app.use('/admin_dashboard', adminRouter);





app.listen(3000);