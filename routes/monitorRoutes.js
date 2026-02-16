import express from "express";
import {
  createMonitor,
  heartbeat,
  pauseMonitor,
  getStatus
} from "../controllers/monitorController.js";

const router = express.Router();

// my defined routes
router.post("/monitors", createMonitor);
router.post("/monitors/:id/heartbeat", heartbeat);
router.post("/monitors/:id/pause", pauseMonitor);
router.get("/monitors/:id/status", getStatus);

export default router;
