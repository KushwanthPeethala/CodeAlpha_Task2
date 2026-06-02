const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');
const { validateProject, sanitizeUpdate } = require('../utils/validate');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id });

    // Attach task counts to each project
    const projectIds = projects.map((p) => p._id);
    const taskCounts = await Task.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      { $group: { _id: '$projectId', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    for (const tc of taskCounts) {
      countMap[tc._id.toString()] = tc.count;
    }

    const projectsWithCounts = projects.map((p) => ({
      ...p.toObject(),
      taskCount: countMap[p._id.toString()] || 0
    }));

    res.json({ projects: projectsWithCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { valid, errors } = validateProject(req.body);
    if (!valid) return res.status(400).json({ message: 'Validation failed', errors });

    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      owner: req.user._id
    });
    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { valid, errors } = validateProject(req.body, { partial: true });
    if (!valid) return res.status(400).json({ message: 'Validation failed', errors });

    const updates = sanitizeUpdate(req.body, ['name', 'description']);

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await Task.deleteMany({ projectId: project._id });
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
