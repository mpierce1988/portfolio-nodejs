
const path = require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');
const querystring = require('querystring');
const email = require('./services/emailService');
//const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const PORT = process.env.PORT || 3000;

const v1ProjectRoutes = require('./v1/routes/projectRoutes');

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

/// Routing

/// API Routing 

app.use('/api/v1/projects', v1ProjectRoutes);

/// Website Routing

// GET requests

app.get('/', async (req, res) => {

    // call api and get projects
    let response = await fetch(`http://localhost:${PORT}/api/v1/projects`);
    let dataFromResponse = await response.json();
    let projects = dataFromResponse.data;

    if(projects.length > 3){
        projects.length = 3;
    }

    console.log(projects);

    let data = {
        title: 'Index Page', 
        year: new Date().getFullYear(),
        projects
    };
    res.render('index', data);
});

app.get('/contact', (req, res) => {
    // Check for invalid email/subject/message/email/subject/message from contactform POST handler
    let errors = [];
    let validEmail = req.query.validEmail;
    let validSubject = req.query.validSubject;
    let validMessage = req.query.validMessage;
    let email = req.query.contactEmail;
    let subject = req.query.subject;
    let message = req.query.message;

    
    if(validEmail == 'false'){
        errors.push('A valid email is required');
        console.log('Email is invalid');
        console.log('Amount of errors so far: ' + errors.length);
    } 

    if(validSubject == 'false'){
        errors.push('A valid subject line is required');
    }

    if(validMessage == 'false'){
        errors.push('A valid message is required');
    }


    let data = {
        title: 'Contact Me',
        year: new Date().getFullYear()
    };

    // Add validation errors, if any
    if(errors.length > 0){
        data.errors = errors;
        console.log(errors);
    }

    // Add form data from previous form attempt, if available
    if(email != null && email != ''){
        data.email = email;
    }

    if(subject != null && subject != ''){
        data.subject = subject;
    }

    if(message != null && message != ''){
        data.message = message;
    }

    console.log(data);

    res.render('contact', data);
});

app.get('/projects', async (req, res) => {

    // call api and get projects
    let response = await fetch(`http://localhost:${PORT}/api/v1/projects`);
    let dataFromResponse = await response.json();
    let projects = dataFromResponse.data;

    let data = {
        title: 'Projects',
        year: new Date().getFullYear(),
        projects
    };

    res.render('projects', data);
});

app.get('/projects/:projectId', async (req, res) => {
    
});

app.get('/resume', (req, res) => {
    let data = {
        title: 'Resume',
        year: new Date().getFullYear()
    };

    res.render('resume', data);
})

app.get('/contactform', (req, res) => {
    res.redirect("/contact");
});

// POST requests

app.post('/contactform', async (req, res) => {
    // validate all inputs
    let contactEmail = req.body.email;
    let subject = req.body.subject;
    let message = req.body.message;

    let errors = {};
    if(!contactEmail){
        errors.validEmail = false;
    }

    if(!subject){
        errors.validSubject = false;
    }

    if(!message){
        errors.validMessage = false;
    }
    
    // If any errors, redirect to the contact page but supply the errors and email/subject/message paramaters as 
    // query parameters. This prevents the user from having to re-enter information when being redirected to the contact page,
    // and allows for appropriate error messages to be displayed to the user
    if(Object.keys(errors).length > 0){
        let formData = {
            contactEmail,
            subject,
            message
        }

        let queryObjects = {...errors, ...formData};
        let errorQuery = querystring.stringify(queryObjects);
        let uri = '/contact?' + errorQuery;
        res.redirect(uri);
        return;
    }

    // At this point, all fields should be valid
    // send email
    await email.sendEmail(subject, message, contactEmail);

    res.render('emailSuccessful');
});


//route for 404 page not found
app.get('*', (req, res) => {
    let data = {
        title: "Page Not Found",
        year: new Date().getFullYear()
    };

    res.render('404', data);
})

// Start server
app.listen(PORT,() => {
    console.log("Server started on port " + PORT);
})