import express from "express";
import { generatePresignedUrl } from "../controllers/r2";

const router = express.Router();

router.post("/pre-signed-url", generatePresignedUrl);

export default router;