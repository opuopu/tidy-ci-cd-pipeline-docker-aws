import authRoutes from "./auth.route.js";
import { Router } from "express";
import otpRoutes from "./otp.routes.js";
import homeRoutes from "./home.route.js";
import homeCategoryRoutes from "./homeCategory.Route.js";
import roomRoutes from "./room.route.js";
import roomPresetRoutes from "./roomPreset.route.js";
const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/otps",
    route: otpRoutes,
  },
  {
    path: "/homes",
    route: homeRoutes,
  },
  {
    path: "/home-categories",
    route: homeCategoryRoutes,
  },
  {
    path: "/room-presets",
    route: roomPresetRoutes,
  },
  {
    path: "/rooms",
    route: roomRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
