import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from './routers/messageRouter.js';
import userRouter from './routers/userRouter.js';
import timelineRoute from "./routers/timelineRoutes.js"
import softwareApplicationRoue from "./routers/softwareApplicationRoutes.js"
import skillRoutes from "./routers/skillRoutes.js"
import projectRoutes from "./routers/projectRoutes.js"

const app = express();
dotenv.config({ path: "./config/config.env" });

// Use CORS for connecting frontend
app.use(cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use file upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// API routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRoute);
app.use("/api/v1/softwareapplication", softwareApplicationRoue);
app.use("/api/v1/skill", skillRoutes);
app.use("/api/v1/project", projectRoutes);


// Database connection
dbConnection();

// Error middleware
app.use(errorMiddleware);

export default app;
