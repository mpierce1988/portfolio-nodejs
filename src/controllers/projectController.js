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

const updateOneProject = async (req, res) => {
    try {
        let id = req.params.id;
        let changes = {
            id: req.body.id,
            projectName: req.body.projectName,
            projectDescription: req.body.projectDescription,
            linkToProjectImage: req.body.linkToProjectImage,
            features: req.body.features,
            linkToProject: req.body.linkToProject
        };

        let updatedProject = await projectService.updateOneProject(id, changes);

        if(!updatedProject) {
            throw {status: 500, message: "Unable to update project document"};
        } else {
            res.status(200).send({status: "OK", data: updatedProject});
        }


    } catch (error) {
        res.status(error?.status || 500).send({status: "FAILED", data: {error: error?.message || error}});
    }
}

module.exports = {getAllProjects, getOneProject, updateOneProject};