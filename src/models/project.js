const mongoose = require('mongoose');

// Create schema
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        trim: true
    },
    linkToProjectImage: {
        type: String,
        required: false
    },
    features: [String],
    linkToProject: {
        type: String,
        required: [true, 'Link to the project is required']
    }
});

// Create model to export
const project = mongoose.model('Project', projectSchema);

module.exports = project;