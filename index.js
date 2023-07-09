const express = require('express');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cors = require('cors');
var appRoot = require('app-root-path');
require('dotenv').config();

const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(cors());
app.options('*', cors());

//Connection Database
const db = require('./src/config/db');
db.connect();

//set view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', '/var/task/views');
// set public directory path.join('/var/task/views')
app.use(express.static(path.join('/public')));

//router
const route = require('./src/routes');

app.use(
    session({
        secret: 'Login',
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 },
    })
);

route(app);

//sever

app.listen(process.env.PORT || 3000, () => {
    console.log(`Đã chạy sever thành công (http://localhost:${process.env.PORT || 3000})`);
});

// Helper function to handle
Handlebars.registerHelper('inc', function (value, options) {
    return parseInt(value) + 1;
});
