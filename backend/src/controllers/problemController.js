const Problem = require('../models/Problem');

// Get a single problem by ID
const getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProblemById
};
