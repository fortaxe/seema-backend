import express from "express";
import {
  sendMessage,
  getUser,
  deleteUser,
  editUser,
  getUserById,
} from "../controllers/user";
import authMiddleware from "../midddleware/auth";

const router = express.Router();

router.post("/user/send-message", sendMessage);
router.get("/user/get-user", authMiddleware("admin"), getUser);
router.patch("/user/edit-user/:userId", authMiddleware("admin"), editUser);
router.delete("/user/delete-user", authMiddleware("admin"), deleteUser);
router.get("/user/get-user/:userId", authMiddleware("admin"), getUserById);

export default router;
