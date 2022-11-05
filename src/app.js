
const path = require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');
const querystring = require('querystring');
const email = require('./services/emailService');
//const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const PORT = process.env.PORT || 3000;
const session = require('express-session');

const loginController = require('./controllers/loginController');

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

app.get('/', async (req, res) => {

    // call api and get projects
    let response = await fetch(`http://localhost:${PORT}/api/v1/projects`);
    let dataFromResponse = await response.json();
    let projects = dataFromResponse.data;

    if(projects.length > 3){
        projects.length = 3;
    }    

    let data = {
        title: 'Index Page', 
        year: new Date().getFullYear(),
        projects,
        isLoggedIn: req.session.isLoggedIn ?? false,
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
    } 

    if(validSubject == 'false'){
        errors.push('A valid subject line is required');
    }

    if(validMessage == 'false'){
        errors.push('A valid message is required');
    }


    let data = {
        title: 'Contact Me',
        year: new Date().getFullYear(),
        isLoggedIn: req.session.isLoggedIn ?? false,
    };

    // Add validation errors, if any
    if(errors.length > 0){
        data.errors = errors;        
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
        projects,
        isLoggedIn: req.session.isLoggedIn ?? false,
    };

    res.render('projects', data);
});

app.get('/projects/:projectId', async (req, res) => {
    // call api and get projects
    let id = req.params.projectId;
    let response = await fetch(`http://localhost:${PORT}/api/v1/projects/${id}`);
    
    let dataFromResponse = await response.json();

    let data = {
        isLoggedIn: req.session.isLoggedIn ?? false,
        year: new Date().getFullYear() 
    };

    if(response.status == 200 && dataFromResponse.status == 'OK'){
        
        let project = dataFromResponse.data;
        data.title = project.projectName;
        data.project = project;

        res.render('individualProject', data);
        return;

    } else {
        data.title = "Project Not Found";

        res.render('404', data);
        return;        
    }
    
});

app.get('/test', (req, res) => {
    let data = {
        title: "Test",
        year: new Date().getFullYear(),
        isLoggedIn: req.session.isLoggedIn ?? false,
    }

    res.render('404', data);
})

app.get('/resume', (req, res) => {
    let data = {
        title: 'Resume',
        year: new Date().getFullYear(),
        isLoggedIn: req.session.isLoggedIn ?? false,
    };

    res.render('resume', data);
})

app.get('/contactform', (req, res) => {
    res.redirect("/contact");
});

app.get('/login', (req, res) => {
    let data = {
        title: 'Login',
        year: new Date().getFullYear(),
        isLoggedIn: req.session.isLoggedIn ?? false,
    };

    res.render('login', data);
});

app.get('/admin', async (req, res) => {
    if(!req.session.isLoggedIn){
        res.redirect('/');
        return;
    }

    // display project information
    // call api and get projects
    let response = await fetch(`http://localhost:${PORT}/api/v1/projects`);
    let dataFromResponse = await response.json();
    let projects = dataFromResponse.data;

    let data = {
        title: "Current Projects",
        year: new Date().getFullYear(),
        isLoggedIn: req.session.isLoggedIn ?? false,
        projects
    }

    res.render('admin', data);

});

app.get('/admin/edit/:projectId', async (req, res) => {
    if(!req.session.isLoggedIn){
        res.redirect('/');
        return;
    }

    let id = req.params.projectId;

    let response = await fetch(`http://localhost:${PORT}/api/v1/projects/${id}`);
    
    let dataFromResponse = await response.json();

    let data = {
        isLoggedIn: req.session.isLoggedIn ?? false,
        year: new Date().getFullYear() 
    };

    if(response.status == 200 && dataFromResponse.status == 'OK'){
        
        let project = dataFromResponse.data;
        data.project = project;
        data.title = project.projectName;        

        res.render('editProject', data);
        return;

    } else {
        data.title = "Project Not Found";

        res.render('404', data);
        return;        
    }
})

// POST requests
app.post('/admin/edit/:projectId', async (req, res) => {
    if(!req.session.isLoggedIn){
        res.redirect('/');
        return;
    }


});

app.post('/login', async (req, res) => {
    let data = {
        title: "Login",
        year: new Date().getFullYear()
    }

    // get username and password from body parser
    let username = req.body.name;
    let password = req.body.password;

    let errors = [];

    if(!username || username == ''){
        errors.push('Username required');
    }

    if(!password || password == ''){
        errors.push('Password required');
    }

    if(errors.length > 0){
        data.errors = errors;
        res.render('login', data);
        return;
    }

    // validate username/password
    let result = await loginController.validateUser(username, password);

    if(result){
        console.log('User approved!');
        req.session.isLoggedIn = true,
        res.redirect('/');
    } else {
        console.log('User Rejected');
        errors.push('Username and/or password invalid');
        req.session.isLoggedIn = false,
        data.errors = errors;
        res.render('login', data);
    }

});

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

app.patch('/admin/edit/:id', async (req, res) => {
    let updatedProject = req.body;

    console.log("PATCH Project ID: " + updatedProject.id);
    let response = await fetch(`http://localhost:${PORT}/api/v1/projects/${updatedProject.id}`, {
        method: "PATCH",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(updatedProject)
    });

    let body = await response.json()
    let projectFromResponse = body.data;    
    
    console.log(projectFromResponse);

    let data = {
        title: projectFromResponse.projectName,
        year: new Date().getFullYear(),
        project: projectFromResponse
    }

    if(response.status == 200){
        console.log('Patch pushed to API successfully');
        data.message = "Changes Saved Successfully";        
    } else {
        data.error = "Something went wrong, changes not saved";
    }

    res.render('editProject', data);
    
})

// Start server
app.listen(PORT,() => {
    console.log("Server started on port " + PORT);
})