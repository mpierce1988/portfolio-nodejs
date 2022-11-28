const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/projectController');

// Set up routes

router.get('/', projectController.getAllProjects);

router.post('/', projectController.createProject);

router.get('/:id', projectController.getOneProject); 

router.patch('/:id', projectController.updateOneProject);

router.delete('/:id', projectController.deleteProject);


module.exports = router;