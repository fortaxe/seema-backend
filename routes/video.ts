import express from "express";
import { 
  createVideo, 
  getVideos, 
  getVideo, 
  updateVideo, 
  deleteVideo, 
  getVideosByCategory 
} from "../controllers/video";
import authMiddleware from "../midddleware/auth";

const router = express.Router();

// Public routes
router.get("/", getVideos);
router.get("/:videoId", getVideo);
router.get("/category/:categoryId", getVideosByCategory);

// Admin only routes
router.post("/", authMiddleware("admin"), createVideo);
router.put("/:videoId", authMiddleware("admin"), updateVideo);
router.delete("/:videoId", authMiddleware("admin"), deleteVideo);

export default router;