const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');

router.post('/', monitorController.createMonitor);
router.post('/:id/heartbeat', monitorController.heartbeat);
router.post('/:id/pause', monitorController.pauseMonitor);

//Monitor status for admins [Added feature]
router.get('/:id', (req, res) => {
  const monitor = require('../services/monitorDevice').getMonitor(req.params.id);
  if (!monitor) return res.status(404).json({ message: 'Not found' });
  res.json(monitor);
});


module.exports = router;
