const express = require('express');
const router = express.Router({ mergeParams: true });
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const { validateTask, sanitizeUpdate } = require('../utils/validate');
const { getIO } = require('../socket');

router.use(protect);

// Get all tasks for a project
// GET /api/projects/:projectId/tasks
router.get('/', async (req, res) => {
  try {
    const projectId = req.params.projectId || req.query.projectId;
    if (!projectId) return res.status(400).json({ message: 'Project ID is required' });

    const tasks = await Task.find({ projectId });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a task
// POST /api/projects/:projectId/tasks
router.post('/', async (req, res) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    if (!projectId) return res.status(400).json({ message: 'Project ID is required' });

    const { valid, errors } = validateTask(req.body);
    if (!valid) return res.status(400).json({ message: 'Validation failed', errors });

    const { title, description, priority, status } = req.body;

    const project = await Project.findOne({ _id: projectId, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      projectId
    });

    // Emit event
    const io = getIO();
    if (io) {
      io.to(projectId.toString()).emit('taskCreated', task);
    }

    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a task
// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findOne({ _id: task.projectId, owner: req.user._id });
    if (!project) return res.status(403).json({ message: 'Not authorized' });

    const updates = sanitizeUpdate(req.body, ['title', 'description', 'status', 'priority']);

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    // Emit event
    const io = getIO();
    if (io) {
      io.to(task.projectId.toString()).emit('taskUpdated', updatedTask);
    }

    res.json({ task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a task
// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findOne({ _id: task.projectId, owner: req.user._id });
    if (!project) return res.status(403).json({ message: 'Not authorized' });

    await task.deleteOne();

    // Emit event
    const io = getIO();
    if (io) {
      io.to(task.projectId.toString()).emit('taskDeleted', task._id);
    }

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
