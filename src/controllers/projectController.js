const projectService = require('../services/projectService');

const getAllProjects = async (req, res) => {
    try {
        let projects = await projectService.getAllProjects();
        console.log(projects);
        res.send({status: "OK", data: projects});
    } catch (error) {
        res.status(error?.status || 500).send({status: "FAILED", data:{error: error?.message || error}});
    }
};

module.exports = {getAllProjects};