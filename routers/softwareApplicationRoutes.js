import express from "express"
import {  deleteApplication, getAllApplications,addnewApplication } from "../controllers/softwareApplicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/add",isAuthenticated,addnewApplication)
router.delete("/delete/:id",isAuthenticated,deleteApplication)
router.get("/getall",getAllApplications)


export default router