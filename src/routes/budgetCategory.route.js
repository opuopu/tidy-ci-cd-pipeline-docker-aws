import express from "express";
import budgetCategoryControllers from "../controllers/budgetCategory.controller.js";

const router = express.Router();

router.post("/", budgetCategoryControllers.insertBudgetCategoryIntoDb);
router.get("/", budgetCategoryControllers.getallFromDb);
router.get("/:id", budgetCategoryControllers.getSingleFromDb);
const budgetCategoryRoutes = router;
export default budgetCategoryRoutes;
