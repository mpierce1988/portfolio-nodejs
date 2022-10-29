const projectRepo = require('../repo/projectRepo');

const getAllProjects = async () => {
    try {
        let projects = await projectRepo.getAllProjects();
        return projects;
    } catch (error) {
        throw error;
    }
}

/**
 * Tries to get a project document via its unique id. If it fails, it throws an error
 * @param {string} id 
 * @returns {object} Project Object
 */
const getOneProject = async (id) => {
    try {
        let project = await projectRepo.getOneProject(id);
        return project;
    } catch (error) {
        throw error;
    }
}

module.exports = {getAllProjects, getOneProject}