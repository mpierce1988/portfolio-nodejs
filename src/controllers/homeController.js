const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const querystring = require('querystring');
const PORT = process.env.PORT || 3000;
const email = require('../services/emailService');

/**
 * Queries the database for projects and shows three of them on the index page
 * @param {*} req 
 * @param {*} res 
 */
const getHomepage = async (req, res) => {
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
};

const getContactPage = (req, res) => {
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
};

const getAllProjectsPage = async (req, res) => {
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
};

const getProductPage = async (req, res) => {
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
};

const getResumePage = (req, res) => {
    let data = {
        title: 'Resume',
        year: new Date().getFullYear(),
        isLoggedIn: req.session.isLoggedIn ?? false,
    };

    res.render('resume', data);
};

const redirectToContactPage = (req, res) => {    
    res.redirect("/contact");
};

const postContactForm = async (req, res) => {
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

    let data = {
        title: "Message Sent Successfully",
        year: new Date().getFullYear()
    }

    res.render('emailSuccessful', data);
}

module.exports = {
    getHomepage,
    getContactPage,
    getAllProjectsPage,
    getProductPage,
    getResumePage,
    redirectToContactPage,
    postContactForm
}