const projectRepo = require('../repo/projectRepo');

const getAllProjects = async () => {
    try {
        let projects = await projectRepo.getAllProjects();
        return projects;
    } catch (error) {
        throw error;
    }
}

module.exports = {getAllProjects}