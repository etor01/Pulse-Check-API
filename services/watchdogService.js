import Monitor from "../models/Monitor.js";

const CHECK_INTERVAL = 10000; // 10 seconds

// Background service to check for monitors that have not sent a heartbeat within their timeout period
const startWatchdog = () => {
  setInterval(async () => {
    try {
      const now = Date.now();

      const activeMonitors = await Monitor.find({
        status: "up"
      });

      for (let monitor of activeMonitors) {
        const elapsedSeconds =
          (now - new Date(monitor.lastHeartbeat).getTime()) / 1000; // 1000ms = 1s 

        if (elapsedSeconds > monitor.timeout) {
          monitor.status = "down";
          await monitor.save();

          console.log({
            ALERT: `Device ${monitor.deviceId} is down!`,
            time: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error("Watchdog error:", error.message);
    }
  }, CHECK_INTERVAL);
};

export default startWatchdog;