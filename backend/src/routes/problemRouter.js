const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');

// Get a single problem by ID
router.get('/:id', problemController.getProblemById);
router.post('/submitproblem/:id', problemController.submitProblem);

module.exports = router;
