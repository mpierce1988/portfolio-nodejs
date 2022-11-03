const mongoDAL = require('./MongoDAL');
const ObjectId = mongoDAL.ObjectId;

const getAllProjects = async() => {
    try {
        let projectsData = await mongoDAL.getDocuments('website', 'projects').catch(error => {
            console.log(error);
            /*throw {status: error?.status || 500, message: error?.message || error};
            */
        });

        let projects = [];

        projectsData.forEach(project => {
            let newProject = {
                id: project._id,
                projectName: project.projectName,
                projectDescription: project.projectDescription,
                linkToProjectImage: project.linkToProjectImage,
                features: project.features,
                linkToProject: project.linkToProject
            };

            projects.push(newProject);
        });
        
        return projects;
    } catch (error) {
        throw error;
    }
};

/**
 * Tries to get a project document via its unique id. If it fails, it throws an error
 * @param {string} id 
 * @returns {object} Project Object
 */
const getOneProject = async (id) => {
    try {
        let project = await mongoDAL.getOneDocument('website', 'projects', id);

        return project;
    } catch (error) {
        throw error;
    }
}

const updateOneProject = async(id, changes) => {
    try {
        let updatedProject = await mongoDAL.updateOneDocument('website', 'projects', id, changes);

        return updatedProject;
    } catch (error) {
        throw error;
    }
}

module.exports = {getAllProjects, getOneProject, updateOneProject};