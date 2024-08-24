import express from "express"

import {getUser, login, logout, register, updatePassword, updateProfile,getProfileForPortfolio, forgotPassword, resetPassword} from '../controllers/userController.js'
import { isAuthenticated } from "../middlewares/auth.js"

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.get("/logout", isAuthenticated,logout)
router.get("/me", isAuthenticated,getUser)
router.put("/updateprofile", isAuthenticated,updateProfile) //updates the  profile 
router.post("/updatepassword", isAuthenticated,updatePassword)
router.get("/me/portfolio", getProfileForPortfolio)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword/:token", resetPassword)


export default router
