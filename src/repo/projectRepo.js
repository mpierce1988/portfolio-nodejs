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

module.exports = {getAllProjects};