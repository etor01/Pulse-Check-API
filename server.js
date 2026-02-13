const express = require("express");

const app = express();
const PORT = process.env.PORT || 5050;

app.listen(PORT, ()=>{
    console.log(`Watchdog started successfully on port ${PORT}`);

    setInterval(()=>{
        console.log('alive')
    }, 1000)
})

//the API accepts a POST/monitors request -->this is creating a monitor | if timer exists , log already exist.Use another id
//->{"id": "device-123", "timeout": 60}
//the systems starts a count down timer for new device=
//201 Created response returned


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

1.  POST/monitors   ||LOG AND RETURN DEVICE ID AND CREATED MSG
2.  POST/monitors/{id}/heartbeat request    ||Check if monitor exists and returns okay or not found/when device paused [status is down] will restart device
3.  POST/monitors/{id}/pause        || Sets the status of the monitor to pause and stops the the timer. 

 final README.md must replace these instructions. It must cover:

Architecture Diagram
Setup Instructions
API Documentation
The Developer's Choice: Explanation of your added feature.


*/