import Monitor from "../models/Monitor.js";

// Endpoint to create a new monitor for a device
export const createMonitor = async (req, res, next) => {
  try {
    const { id, timeout, alert_email } = req.body;

    if (!id || !timeout || !alert_email) {
      return res.status(400).json({
        message: "id, timeout and alert_email are required"
      });
    }

    const existing = await Monitor.findOne({ deviceId: id });
    if (existing) {
      return res.status(400).json({
        message: "Monitor with this ID already exists"
      });
    }

    const monitor = await Monitor.create({
      deviceId: id,
      timeout,
      alertEmail: alert_email,
      status: "up",
      lastHeartbeat: new Date()
    });

    res.status(201).json({
      success: true,
      data: monitor
    });

  } catch (error) {
    next(error);
  }
};

// Heartbeat endpoint to update last heartbeat time and status
export const heartbeat = async (req, res, next) => {
  try {
    const { id } = req.params;

    const monitor = await Monitor.findOne({ deviceId: id });
    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found"
      });
    }

    monitor.lastHeartbeat = new Date();
    monitor.status = "up";

    await monitor.save();

    res.status(200).json({
      message: "Heartbeat received"
    });

  } catch (error) {
    next(error);
  }
};

// Endpoint to pause monitoring for a device - sets status to "paused"
export const pauseMonitor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const monitor = await Monitor.findOne({ deviceId: id });
    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found"
      });
    }

    monitor.status = "paused";
    await monitor.save();

    res.json({
      message: "Monitor paused"
    });

  } catch (error) {
    next(error);
  }
};

// Endpoint to get current status of a device, including time remaining until it would be marked down
export const getStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const monitor = await Monitor.findOne({ deviceId: id });
    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found"
      });
    }

    let timeRemaining = null;

    if (monitor.status === "up") {
      const elapsed =
        (Date.now() - new Date(monitor.lastHeartbeat).getTime()) / 1000;

      timeRemaining = Math.max(0, monitor.timeout - Math.floor(elapsed));
    }

    res.json({
      deviceId: monitor.deviceId,
      status: monitor.status,
      timeRemaining
    });

  } catch (error) {
    next(error);
  }
};
