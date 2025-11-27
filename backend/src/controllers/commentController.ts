import Comment from "../models/Comment";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";

export const addComment = async (req: AuthRequest, res: Response) => {
    const { text } = req.body;
    const { postId } = req.params;

    const comment = await Comment.create({
        text,
        userId: req.user!.id,
        postId: parseInt(postId)
    });

    res.json(comment);
};
