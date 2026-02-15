const monitorDevice = require('../services/monitorDevice');

exports.createMonitor = (req, res) => {
  const { id, timeout, alert_email } = req.body;

  if (!id || !timeout || !alert_email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    monitorDevice.createMonitor(id, timeout, alert_email);
    return res.status(201).json({ message: 'Monitor created successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.heartbeat = (req, res) => {
  const { id } = req.params;

  const monitor = monitorDevice.heartbeat(id);

  if (!monitor) {
    return res.status(404).json({ message: 'Monitor not found' });
  }

  return res.status(200).json({ message: 'Heartbeat received' });
};

exports.pauseMonitor = (req, res) => {
  const { id } = req.params;

  const monitor = monitorDevice.pauseMonitor(id);

  if (!monitor) {
    return res.status(404).json({ message: 'Monitor not found' });
  }

  return res.status(200).json({ message: 'Monitor paused' });
};
