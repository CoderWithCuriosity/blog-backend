import express from "express";
import { createPost, getPost, getPosts } from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";
import { adminOnly } from "../middlewares/adminMiddleware";

const router = express.Router();

router.get("/", getPosts);
router.get("/:slug", getPost);

//admin only
router.post("/", protect, adminOnly, createPost);

export default router;