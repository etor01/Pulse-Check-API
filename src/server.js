import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import monitorRoutes from "./routes/monitorRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import startWatchdog from "./services/watchdogService.js";

const app = express();
app.use(express.json());
app.use("/api", monitorRoutes);
app.get("/", (req, res) => res.json({ message: "Pulse-Check-API is running" }));
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const start = async () => {
  await connectDB();      // only proceeds if DB connects
  startWatchdog();        // safe to start 

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
