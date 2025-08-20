import express from "express";
import { createVideo, getVideos, getVideo, updateVideo, deleteVideo, deleteModule, addVideoToModule } from "../controllers/video";
import authMiddleware from "../midddleware/auth.ts";

const router = express.Router();

router.post("/module/create", authMiddleware("admin"), createVideo);
router.get("/module/get",  getVideos);
router.get("/module/get/:videoId", getVideo);
router.put("/module/update/:moduleId", authMiddleware("admin"), updateVideo);
router.post("/module/:moduleId/add-video", authMiddleware("admin"), addVideoToModule);
router.delete("/module/delete", authMiddleware("admin"), deleteVideo);
router.delete("/module/delete/module", authMiddleware("admin"), deleteModule);

export default router;