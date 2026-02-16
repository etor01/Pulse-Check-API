import 'dotenv/config';
import express from "express";
import connectDB from "./config/db.js";
import monitorRoutes from "./routes/monitorRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import startWatchdog from "./services/watchdogService.js";

const app = express();

//Initialize database and watchdog
connectDB();
startWatchdog();

app.use(express.json());

//routes
app.use("/api", monitorRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Pulse-Check-API is running" });
});

//middleware for error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
