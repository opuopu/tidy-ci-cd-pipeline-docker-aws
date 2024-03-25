import authRoutes from "./auth.route.js";
import { Router } from "express";
import otpRoutes from "./otp.routes.js";
import homeRoutes from "./home.route.js";
import roomRoutes from "./room.route.js";
import userRoutes from "./user.route.js";
import homeOwnerRoutes from "./homeOwner.route.js";
import groceryCategoryRoutes from "./groceryCategory.route.js";
import groceryListRoutes from "./groceryList.route.js";
import recipeRoutes from "./recipe.routes.js";
import budgetCategoryRoutes from "./budgetCategory.route.js";
import budgetRoutes from "./budget.route.js";
import userGroceryListsRoutes from "./userGroceryList.route.js";
import taskCategoryRoutes from "./taskCategory.route.js";
import taskListRoutes from "./taskList.route.js";
import tagsRoutes from "./tags.route.js";
import notificationRoutes from "./notificationRoutes.js";
import employeeRoutes from "./employee.route.js";
import workScheduleRoutes from "./workSchedule.route.js";
import FavouriteRecipeRoutes from "./FavouriteRecipe.route.js";
import expenseRouter from "./expense.router.js";
import additionalTaskRoutes from "./additionalTask.route.js";
import packagteRoutes from "./package.route.js";
import Subscription from "../models/subscription.model.js";
import SubscriptionRoutes from "./subscription.route.js";
import assignSchedulesRoutes from "./assignSchedule.route.js";
import taskcompletationHistoryRoutes from "./taskcompletationHistory.route.js";
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
    path: "/rooms",
    route: roomRoutes,
  },
  { path: "/grocery-categories", route: groceryCategoryRoutes },
  {
    path: "/grocery-lists",
    route: groceryListRoutes,
  },
  {
    path: "/tags",
    route: tagsRoutes,
  },
  {
    path: "/favourite-recipes",
    route: FavouriteRecipeRoutes,
  },
  {
    path: "/recipes",
    route: recipeRoutes,
  },
  {
    path: "/budget-categories",
    route: budgetCategoryRoutes,
  },
  {
    path: "/budgets",
    route: budgetRoutes,
  },
  {
    path: "/expenses",
    route: expenseRouter,
  },
  {
    path: "/additional-task",
    route: additionalTaskRoutes,
  },
  {
    path: "/history",
    route: taskcompletationHistoryRoutes,
  },
  {
    path: "/user-grocery-lists",
    route: userGroceryListsRoutes,
  },
  {
    path: "/task-categories",
    route: taskCategoryRoutes,
  },
  {
    path: "/tasks-presets",
    route: taskListRoutes,
  },
  {
    path: "/assign-schedules",
    route: assignSchedulesRoutes,
  },
  {
    path: "/work-schedules",
    route: workScheduleRoutes,
  },
  {
    path: "/notifications",
    route: notificationRoutes,
  },
  {
    path: "/employees",
    route: employeeRoutes,
  },
  {
    path: "/packages",
    route: packagteRoutes,
  },
  {
    path: "/subscriptions",
    route: SubscriptionRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
