const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(bodyParser.json());

//In memory store for device. Structure{device_id: { timeout, alert_email, status, timerObj }}
const monitors = {};

//The pulse
const triggerAlert = (id) => {
    monitors[id].status = 'down';
    console.log(JSON.stringify({
        ALERT: `Device ${id} is down!`,
        time: new Date().toISOString(),
        email_sent_to: 'admin@critmon.com'
    }, null, 2));
};

// USER STORY 1: Register a device  /monitors
app.post('/monitors', (req, res) => {
    const { id, timeout, alert_email } = req.body;
    //input validation to prevent ghost device
    if (!id || !timeout) {
        return res.status(400).json({ error: "Missing id or timeout" });
    }
    //prevent duplicates monitors
    if (id===monitors.id){
        return res.status(409).json({ error: "ID Conflict, Device already exist"})
    }

    monitors[id] = {
        timerDone: false,
        timeout,
        alert_email,
        status: 'active',
        // start countdown immediately
        timerObj: setTimeout(() => {
            triggerAlert(id)
            timerDone=true;
        }, timeout * 1000)
    };

    res.status(201).json({ message: `Monitor for ${id} started at :(${timeout}s)` });
});


//USER STORY 2: The heartbeat  //monitors/${id}/heartbeat
app.post(`/monitors/${id}/heartbeat`, (req, res) => {
    const { id } = req.params;
    const monitor = monitors[id];
    const status = monitors[status];

    if (id===monitor && status==='active') {
        clearTimeout(monitors[id].timerObj);
        return res.status(200).json(` Ok. Monitor for ${id} exists, Timer restarts: (${timeout}s)`);
    }

    if (!monitor) {
        return res.status(404).json({ error: "Monitor not found" });
    }

    if (id===monitor && status === 'down') {
        console.log(JSON.stringify({
            INFO: `Device ${id} is back online!`,
            time: new Date().toISOString()
        }, null, 2));
    }

    // Reset logic
    clearTimeout(monitor.timerObj);
    monitor.status = 'active';
    monitor.timerObj = setTimeout(() => triggerAlert(id), monitor.timeout * 1000);

    res.status(200).json({ message: "Heartbeat received. Timer reset." });
});

//USER STORY 3:
setInterval(()=>{
  console.log(222);
  
}, 1000)

app.post('/monitors/:id/pause', (req, res) => {
    const { id } = req.params;
    const monitor = monitors[id];

    if (!monitor) return res.status(404).json({ error: "Monitor not found" });

    clearTimeout(monitor.timerObj);
    monitor.status = 'paused';

    res.status(200).json({ message: `Monitoring for ${id} paused.` });
});

app.listen(PORT, () => {
    console.log(`Watchdog Sentinel active on port ${PORT}`);
});


//API accepts a POST/monitors/{id}/heartbeat request
//if id exist and timer isnt =0 | then reset timer | return 200 Ok
//If id does not exist 404 file not found.

//if timer reacher 0 and pulse not recieved || API system will fire webhooks.
//Webhooks will be implemented in the console as {"ALERT": "Device ${device-id} down!", "time": <timestamp>}
//monitor status changes to down.

//Post/monitors/{id}/pause | Stops the timer completely no alerts
// Callling the heartbeat function | POST/monitors/{id}/heartbeat restart the pulse.

/*
ENDPOINTS

2.  POST/monitors/{id}/heartbeat request    ||Check if monitor exists and returns okay or not found/when device paused [status is down] will restart device
3.  POST/monitors/{id}/pause        || Sets the status of the monitor to pause and stops the the timer. 

 final README.md must replace these instructions. It must cover:

Architecture Diagram
Setup Instructions
API Documentation
The Developer's Choice: Explanation of your added feature.


*/