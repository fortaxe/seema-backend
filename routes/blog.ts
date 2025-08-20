import express from "express";
import { createBlog, getBlogs, getBlog, updateBlog, deleteBlog } from "../controllers/blogs";
import authMiddleware from "../midddleware/auth";
const router = express.Router();

router.post("/blog/create", authMiddleware("admin"), createBlog);
router.get("/blog/get",  getBlogs);
router.get("/blog/get/:blogId", authMiddleware("admin"), getBlog);
router.patch("/blog/update/:blogId", authMiddleware("admin"), updateBlog);
router.delete("/blog/delete", authMiddleware("admin"), deleteBlog);

export default router;