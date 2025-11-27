import express from "express";
import { addComment } from "../controllers/commentController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// only logged in users can comment
router.post("/:postId", protect, addComment);

export default router;
