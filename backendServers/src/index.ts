import express, { type Express } from "express";
import cors from "cors";
import { CONFIG } from "./config.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(CONFIG.port, () => {
  console.log(`Backend server running on port ${CONFIG.port}`);
});

export default app;
