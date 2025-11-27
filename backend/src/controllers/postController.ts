import Post from "../models/Post";
import slugify from 'slugify';
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.body) {
            return res.json({ message: 'Title, Content, Image Required' })
        }
        const { title, content, image } = req.body;

        const slug = slugify(title, { lower: true });

        const post = await Post.create({
            title,
            slug,
            content,
            image,
            userId: req.user!.id
        });
        return res.json(post);
    } catch (error) {
        res.status(404).json({
            message: "Invalid Endpoint/Payload"
        })
    }
}

export const getPosts = async (req: Request, res: Response) => {
    const posts = await Post.findAll();
    await res.json(posts);
}

export const getPost = async (req: Request, res: Response) => {
    const post = await Post.findOne({ where: { slug: req.params.slug } });
    if(!post){
        return res.status(404).json({
            message: "Post Not Found/Deleted"
        })
    }
    return res.json(post)
}