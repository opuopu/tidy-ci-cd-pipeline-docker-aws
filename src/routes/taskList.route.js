import express from "express";
import taskListControllers from "../controllers/taskList.controller.js";
const router = express.Router();
router.post("/", taskListControllers.insertTaskListIntoDB);
router.get("/", taskListControllers.getAllTaskList);
router.get("/:id", taskListControllers.getSingleTask);
const taskListRoutes = router;
export default taskListRoutes;
