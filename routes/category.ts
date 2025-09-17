import express from "express";
import { 
  createCategory, 
  getCategories, 
  getCategory, 
  updateCategory, 
  deleteCategory 
} from "../controllers/category";
import authMiddleware from "../midddleware/auth";

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/:categoryId", getCategory);

// Admin only routes
router.post("/", authMiddleware("admin"), createCategory);
router.put("/:categoryId", authMiddleware("admin"), updateCategory);
router.delete("/:categoryId", authMiddleware("admin"), deleteCategory);

export default router;
