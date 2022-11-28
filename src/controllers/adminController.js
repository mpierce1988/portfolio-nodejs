const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const loginController = require('../controllers/loginController');
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost:5000';

const getLoginPage = (req, res) => {
    let data = {
        title: 'Login',
        year: new Date().getFullYear(),
        isLoggedIn: req.session.isLoggedIn ?? false,
    };

    res.render('login', data);
};

const getAdminPage = async (req, res) => {
    if(!req.session.isLoggedIn){
        res.redirect('/');
        return;
    }

    // display project information
    // call api and get projects
    let response = await fetch(`${HOST}/api/v1/projects`);
    let dataFromResponse = await response.json();
    let projects = dataFromResponse.data;

    let data = {
        title: "Current Projects",
        year: new Date().getFullYear(),
        isLoggedIn: req.session.isLoggedIn ?? false,
        projects
    }

    res.render('admin', data);
}

const getCreateProject = async (req, res) => {
    if(!req.session.isLoggedIn){
        res.redirect('/');
        return;
    }

    let data = {
        title: "Current Projects",
        year: new Date().getFullYear(),
        isLoggedIn: req.session.isLoggedIn ?? false,
    }

    res.render('createProject', data);
}

const getEditProject = async (req, res) => {
    if(!req.session.isLoggedIn){
        res.redirect('/');
        return;
    }

    let id = req.params.projectId;

    let response = await fetch(`${HOST}/api/v1/projects/${id}`);
    
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
}

const patchProject = async (req, res) => {
    if(!req.session.isLoggedIn){
        res.redirect('/');
        return;
    }
    console.log("Post body: \r" + JSON.stringify(req.body));

    let updatedProject = {
        id: req.body.id,
        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        linkToProjectImage: req.body.linkToProjectImage,
        features: req.body.feature,
        linkToProject: req.body.linkToProject
    }    
   
    let response = await fetch(`${HOST}/api/v1/projects/${updatedProject.id}`, {
        method: "PATCH",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(updatedProject)
    });

    let body = await response.json()
    let projectFromResponse = body.data; 

    let data = {
        isLoggedIn: req.session.isLoggedIn ?? false,
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
}

const deleteProject = async (req, res) => {

    if(!req.session.isLoggedIn){
        res.redirect('/');
        return;
    }

    const projectId = req.body.id;

    let response = await fetch(`${HOST}/api/v1/projects/${projectId}`, {
        method: "DELETE",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({id: projectId})
    });

    const body = await response.json();

    let data = {
        isLoggedIn: req.session.isLoggedIn ?? false,
        year: new Date().getFullYear()
    }

    if(response.status == 200){
        // deletion successful        
        let deletedProject = body.data;

        data.title = `${deleteProject.projectName} Deleted`;
        data.project = deletedProject;
        res.render('projectProcessor', data);
    } else {
        // something went wrong
        data.title = "Unable to delete";
        let errors = [body.data.error];
        data.errors = errors;

        let failedToDeleteProject = {
            id: req.body.id,
            projectName: req.body.projectName,
            projectDescription: req.body.projectDescription,
            linkToProjectImage: req.body.linkToProjectImage,
            features: req.body.features,
            linkToProject: req.body.linkToProject
        }

        data.project = failedToDeleteProject;

        res.render('editProject', data)
    }

};

const createProject = async (req, res) => {
    if(!req.session.isLoggedIn){
        res.redirect('/');
        return;
    }

    let newProject = {
        id: req.body.id,
        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        linkToProjectImage: req.body.linkToProjectImage,
        features: req.body.features,
        linkToProject: req.body.linkToProject
    }

    let data = {
        isLoggedIn: req.session.isLoggedIn ?? false,
        title: newProject.projectName,
        year: new Date().getFullYear()
    }

    let response = await fetch(`${HOST}/api/v1/projects/`, {
        method: "POST",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(newProject)
    });

    let dataFromResponse = await response.json();
    let projectFromServer = dataFromResponse.data;

    if(response.status < 200 || response.status > 299) {
        // create failed
        let error = body.data?.error || "New Project failed creation rejected by server";
        data.error = error;
        res.render('createProject', data);
        return;
    }

    console.log("NEW PROJECT FROM SERVER: " + JSON.stringify(projectFromServer));

    data.project = projectFromServer;
    data.message = "New Project Created Successfully";
    res.render('projectProcessor', data);
};

const postLogin = async (req, res) => {
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
        req.session.isLoggedIn = true,
        res.redirect('/');
    } else {        
        req.session.isLoggedIn = false,
        data.isLoggedIn = req.session.isLoggedIn ?? false;
        data.errors = errors;
        res.render('login', data);
    }
}

module.exports = {
    getLoginPage,
    getAdminPage,
    getCreateProject,
    getEditProject,
    patchProject,
    deleteProject,
    createProject,
    postLogin
}