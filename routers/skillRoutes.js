import express from "express"
import {addNewSkills,deleteSkills,updateSkills,getAllSkills} from "../controllers/skillController.js"
import { isAuthenticated } from "../middlewares/auth.js"


const router = express.Router()


router.post("/add",isAuthenticated,addNewSkills)
router.delete("/delete/:id",isAuthenticated,deleteSkills)
router.put("/update/:id",isAuthenticated,updateSkills)
router.get("/getall",isAuthenticated,getAllSkills)

export default router