import express from "express";
import budgetCategoryControllers from "../controllers/budgetCategory.controller.js";
import auth from "../middlewares/auth.js";
import { USER_ROLE } from "../constant/user.role.js";
import fileUpload from "../middlewares/fileUpload.js";
import parseData from "../middlewares/parseData.js";
const upload = fileUpload("./public/uploads/icons/");
const router = express.Router();

router.post(
  "/",
  upload.single("file"),
  parseData(),
  auth(USER_ROLE.HOMEOWNER),
  budgetCategoryControllers.insertBudgetCategoryIntoDb
);
router.get(
  "/",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  budgetCategoryControllers.getallFromDb
);
router.get(
  "/:id",
  auth(USER_ROLE.HOMEOWNER, USER_ROLE.EMPLOYEE),
  budgetCategoryControllers.getSingleFromDb
);
const budgetCategoryRoutes = router;
export default budgetCategoryRoutes;
