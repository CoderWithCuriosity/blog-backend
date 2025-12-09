import express from "express";
import { createPost, deletePost, getPost, getPosts, updatePost } from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";
import { adminOnly } from "../middlewares/adminMiddleware";
import upload from "../config/multer";

const router = express.Router();

router.get("/", getPosts);
router.get("/:slug", getPost);

//admin only (protected route)
router.post("/", protect, adminOnly, createPost);
router.put("/:id", protect, adminOnly, upload.array('images', 10), updatePost);
router.delete("/:id", protect, adminOnly, upload.array('images', 10), deletePost);

export default router;