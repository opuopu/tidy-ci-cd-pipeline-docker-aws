import authRoutes from "./auth.route.js";
import { Router } from "express";
import otpRoutes from "./otp.routes.js";
import homeRoutes from "./home.route.js";
const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/otp",
    route: otpRoutes,
  },
  {
    path: "/home",
    route: homeRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
