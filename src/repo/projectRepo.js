const mongoDAL = require('./MongoDAL');

const getAllProjects = async() => {
    try {
        let projects = await mongoDAL.getDocuments('website', 'projects').catch(error => {
            console.log(error);
            /*throw {status: error?.status || 500, message: error?.message || error};
            */
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

module.exports = {getAllProjects, getOneProject};