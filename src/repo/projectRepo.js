const Project = require('../models/project');

const getAllProjects = async () => {
    // return an array of projects
    try {
        let docs = await Project.find();

        const projects = docs.map(doc => {
            return {
                id: doc._id,
                projectName: doc.name,
                projectDescription: doc.description,
                linkToProjectImage: doc.linkToProjectImage,
                features: doc.features,
                linkToProject: doc.linkToProject
            };        
        });

        return projects;
    } catch (error) {
        throw {status: error?.status || 500, message: error?.message || error};
    }
};

const getOneProject = async (id) => {
    try {
        let project = await Project.findById(id);

        return project;

    } catch (error) {
        throw {status: error?.status || 500, message: error?.message || error};
    }
}

const updateOneProject = async (id, changes) => {
    try {
        const change = {
            name: changes.projectName,
            description: changes.projectDescription,
            linkToProjectImage: changes.linkToProjectImage,
            features: changes.features,
            linkToProject: changes.linkToProject
        };

        let updatedProject = await Project.findByIdAndUpdate(id, change, {returnDocument: "after"});
        return updatedProject;
    } catch (error) {
        if(error.name === "ValidationError"){
            let validationErrors = error.errors.map(error => error.message);
            throw {status: 400, errors: validationErrors};
        }

        throw {status: error?.status || 500, message: error?.message || error};
    }
}

const createProject = async (project) => {
    try {
        const formattedProject = {
            name: project.projectName,
            description: project.projectDescription,
            linkToProjectImage: project.linkToProjectImage,
            features: project.features,
            linkToProject: project.linkToProject
        };

        let doc = await Project.create(formattedProject);

        let result = {
            id: doc._id,
                projectName: doc.name,
                projectDescription: doc.description,
                linkToProjectImage: doc.linkToProjectImage,
                features: doc.features,
                linkToProject: doc.linkToProject
        }
        return result;
    } catch (error) {
        if(error.name === "ValidationError"){
            let validationErrors = error.errors.map(error => error.message);
            throw {status: 400, errors: validationErrors};
        }

        throw {status: error?.status || 500, message: error?.message || error};
    }
}

const deleteProject = async (id) => {
    try {
        let result = await Project.findByIdAndDelete(id);

        if(!result){
            throw {status: 400, message: `Delete failed, cannot find document with id ${id}`}
        }

        return result;
    } catch (error) {
        throw {status: error?.status || 500, message: error?.message || error};
    }
}

module.exports = {
    getAllProjects,
    getOneProject,
    updateOneProject,
    createProject,
    deleteProject
}