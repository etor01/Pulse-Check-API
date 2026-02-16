import express from "express";
import {
  createMonitor,
  heartbeat,
  pauseMonitor,
  getStatus
} from "../controllers/monitorController.js";

const router = express.Router();

// my defined routes
router.post("/monitors", createMonitor);  //creating a new monitor
router.post("/monitors/:id/heartbeat", heartbeat); //sending a heartbeat for a monitor
router.post("/monitors/:id/pause", pauseMonitor); //setting a monitor heartbeat to paused
router.get("/monitors/:id/status", getStatus); //getting the status of a monitor (up, down, paused) 

export default router;
