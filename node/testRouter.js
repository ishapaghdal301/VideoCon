const express = require('express');
const router = express.Router();
const Problem  = require('./models/Problem');
const Test  = require('./models/Test');

// Get all tests
router.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find().populate('problems');
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single test by ID
router.get('/tests/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate('problems');
    if (test == null) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a test
router.post('/add-test', async (req, res) => { 
  const { title, description } = req.body; 
  try {
    const test = new Test({ title, description });
    await test.save();
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a problem to a test
router.post('/tests/:id/add-problem', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (test == null) {
      return res.status(404).json({ message: 'Test not found' });
    }
    const { title, description , sampleInput,
        sampleOutput,
        testCases} = req.body; 
    const problem = new Problem({ title, description , sampleInput,
        sampleOutput,
        testCases});
    const newProblem = await problem.save();
    test.problems.push(newProblem._id);
    await test.save();
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/problems/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (problem == null) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
