const projectService = require('../services/projectService');

const getAllProjects = async (req, res) => {
    try {
        let projects = await projectService.getAllProjects();        
        res.send({status: "OK", data: projects});
    } catch (error) {
        res.status(error?.status || 500).send({status: "FAILED", data:{error: error?.message || error}});
    }
};

const getOneProject = async (req, res) => {
    try {
        // get project id from path parameter
        let projectId = req.params.id;
        let project = await projectService.getOneProject(projectId);
        res.send({status: "OK", data: project});
    } catch (error) {
        res.status(error?.status || 500).send({status: "FAILED", data: {error: error?.message || error}});
    }
}

module.exports = {getAllProjects, getOneProject};