const monitors = new Map();

function startTimer(id) {
  const monitor = monitors.get(id);

  if (!monitor) return;

  if (monitor.timer) {
    clearTimeout(monitor.timer);
  }

  monitor.timer = setTimeout(() => {
    monitor.status = 'down';
    console.log({
      ALERT: `Device ${id} is down!`,
      time: new Date().toISOString()
    });
  }, monitor.timeout * 1000);

  monitor.status = 'up';
}

function createMonitor(id, timeout, alertEmail) {
  if (monitors.has(id)) {
    throw new Error('Monitor already exists');
  }

  const monitor = {
    id,
    timeout,
    alertEmail,
    status: 'up',
    timer: null,
    paused: false
  };

  monitors.set(id, monitor);
  startTimer(id);

  return monitor;
}

function heartbeat(id) {
  const monitor = monitors.get(id);
  if (!monitor) return null;

  if (monitor.paused) {
    monitor.paused = false;
  }

  startTimer(id);
  return monitor;
}

function pauseMonitor(id) {
  const monitor = monitors.get(id);
  if (!monitor) return null;

  clearTimeout(monitor.timer);
  monitor.paused = true;
  monitor.status = 'paused';

  return monitor;
}

function getMonitor(id) {
  return monitors.get(id);
}

module.exports = {
  createMonitor,
  heartbeat,
  pauseMonitor,
  getMonitor
};
