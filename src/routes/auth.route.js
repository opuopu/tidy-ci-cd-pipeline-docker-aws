import express from "express";
import authControllers from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", authControllers.signUp);
router.post("/signin", authControllers.signIn);

const authRoutes = router;
export default authRoutes;
