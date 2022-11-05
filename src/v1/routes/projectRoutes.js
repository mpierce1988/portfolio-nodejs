const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/projectController');

// Set up routes

router.get('/', projectController.getAllProjects);

router.get('/:id', projectController.getOneProject), 

router.patch('/:id', projectController.updateOneProject)

module.exports = router;