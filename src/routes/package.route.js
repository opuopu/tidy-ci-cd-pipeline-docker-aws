import express from "express";
import packageControllers from "../controllers/Package.controller.js";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";

const router = express.Router();

router.post("/", auth(USER_ROLE.ADMIN), packageControllers.createPackageIntoDB);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  packageControllers.createPackageIntoDB
);
router.post(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  packageControllers.createPackageIntoDB
);
const packagteRoutes = router;
export default packagteRoutes;
