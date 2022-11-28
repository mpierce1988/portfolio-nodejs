
const path = require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');


//const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const PORT = process.env.PORT || 3000;
const session = require('express-session');

const homeController = require ('./controllers/homeController');
const adminController = require('./controllers/adminController');


const v1ProjectRoutes = require('./v1/routes/projectRoutes');

// Start mongoose
require('./repo/mongoose');

// Define paths for Express configuration
const publicDirPath = express.static(path.join(__dirname, '../public'));
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up handlebars as view engine and views path
app.set('view engine', 'hbs');
app.set('views', viewsPath);

// Set up public directory
app.use(publicDirPath);

// Set up partial path with hbs
hbs.registerPartials(partialsPath);

// set up body parsing middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
    }
}))

/// Routing

/// API Routing 

app.use('/api/v1/projects', v1ProjectRoutes);

/// Website Routing

// GET requests

app.get('/', homeController.getHomepage);

app.get('/contact', homeController.getContactPage);

app.get('/projects', homeController.getAllProjectsPage);

app.get('/projects/:projectId', homeController.getProductPage);


app.get('/resume', homeController.getResumePage);

app.get('/contactform', homeController.redirectToContactPage);

app.get('/login', adminController.getLoginPage);

app.get('/admin', adminController.getAdminPage);

app.get('/admin/project', adminController.getCreateProject);

app.get('/admin/projects/:projectId', adminController.getEditProject);

// POST requests

app.post('/admin/projects/deleteproject', adminController.deleteProject);

app.post('/admin/projects/:projectId', adminController.patchProject);

app.post('/admin/project', adminController.createProject);

app.post('/login', adminController.postLogin);

app.post('/contactform', homeController.postContactForm);

// Start server
app.listen(PORT,() => {
    console.log("Server started on port " + PORT);
})