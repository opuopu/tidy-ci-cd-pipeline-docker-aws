import authRoutes from "./auth.route.js";
import { Router } from "express";
import otpRoutes from "./otp.routes.js";
import homeRoutes from "./home.route.js";
import homeCategoryRoutes from "./homeCategory.Route.js";
import roomRoutes from "./room.route.js";

import tagsRoutes from "./tags.route.js";

import roomPresetRoutes from "./roomPreset.route.js";
import userRoutes from "./user.route.js";
import homeOwnerRoutes from "./homeOwner.route.js";
import groceryCategoryRoutes from "./groceryCategory.route.js";
import groceryListRoutes from "./groceryList.route.js";

const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/homeowners",
    route: homeOwnerRoutes,
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
  {

    path: "/tags",
    route: tagsRoutes,

    path: "/grocery-categories",
    route: groceryCategoryRoutes,
  },
  {
    path: "/grocery-lists",
    route: groceryListRoutes,

  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
