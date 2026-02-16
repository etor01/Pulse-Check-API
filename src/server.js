import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import monitorRoutes from "./routes/monitorRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import startWatchdog from "./services/watchdogService.js";

const app = express();
app.use(express.json());
app.use("/api", monitorRoutes);
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "public")));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const start = async () => {
  await connectDB();      
  startWatchdog();        

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
