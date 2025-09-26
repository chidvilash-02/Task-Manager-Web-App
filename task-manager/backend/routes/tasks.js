const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});
router.post('/', auth, async (req, res) => {
  const task = new Task({ ...req.body, user: req.user.id });
  await task.save();
  res.json(task);
});
router.put('/:id', auth, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || task.user.toString() !== req.user.id) return res.status(401).end();
  Object.assign(task, req.body);
  await task.save();
  res.json(task);
});
router.delete('/:id', auth, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || task.user.toString() !== req.user.id) return res.status(401).end();
  await task.deleteOne();
  res.json({ message: 'Deleted' });
});
module.exports = router;