const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/projectController');

// Set up routes

router.get('/', projectController.getAllProjects);

module.exports = router;