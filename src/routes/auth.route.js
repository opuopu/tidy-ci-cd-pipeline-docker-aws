import express from "express";
import authControllers from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", authControllers.signUp);
router.post("/signin", authControllers.signIn);
router.post("/refreshToken", authControllers.refreshToken);
router.post("/forgotPassword", authControllers.forgotPassword);
router.patch("/updatePassword/:email", authControllers.updatePassword);
const authRoutes = router;
export default authRoutes;
