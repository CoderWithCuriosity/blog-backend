import Post from "../models/Post";
import PostImage from "../models/PostImage";
import slugify from 'slugify';
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import fs from 'fs';
import path from 'path';


export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.body) {
            return res.json({
                'success': false,
                message: 'Title, Content, Required. Image(s) Optonal'
            })
        }
        const { title, content } = req.body;

        const slug = slugify(title, { lower: true });

        let images: string[] = [];
        if (req.files && Array.isArray(req.files)) {
            images = (req.files as Express.Multer.File[]).map(file => file.path);
        }

        const post = await Post.create({
            title,
            slug,
            content,
            userId: req.user!.id
        });

        //create post image record if images exists
        if (images.length > 0) {
            const postImages = images.map(image => ({
                image,
                postId: (post.id).toString()
            }));
            await PostImage.bulkCreate(postImages);
        }
        return res.status(201).json({
            'success': true,
            data: post
        });
    } catch (error) {
        //Clean up uploaded files if there's an error
        if (req.files && Array.isArray(req.files)) {
            (req.files as Express.Multer.File[]).forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path)
                }
            })
        }
        res.status(500).json({
            'success': false,
            message: 'Failed to create post'
        })
    }
}

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: PostImage,
                    attributes: ['id', 'image']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({
            'success': true,
            'count': posts.length,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            'success': false,
            'message': 'Failed to fetch posts'
        })
    }
}

export const getPost = async (req: Request, res: Response) => {
    try {
        const post = await Post.findOne({
            where: { slug: req.params.slug }, include: [
                {
                    model: PostImage,
                    attributes: ['id', 'image']
                }
            ]
        });
        if (!post) {
            return res.status(404).json({
                message: "Post Not Found/Deleted"
            })
        }
        return res.json({
            'success': true,
            data: post
        })
    } catch (error) {
        res.status(500).json({
            'success': false,
            'message': 'Failed to fetch posts'
        })
    }
}

export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.body) {
            return res.json({
                'success': false,
                'message': 'Title, Content, Required. Image(s) Optonal'
            })
        }
        const { title, content, deleteImages } = req.body;
        const postId = req.params.id;

        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({
                'success': false,
                'message': 'Post not found'
            })
        }

        //check ownership
        if (post.userId !== req.user!.id) {
            return res.status(401).json(
                {
                    'success': false,
                    'message': 'Not authorized to update this post'
                }
            )
        }

        //Handle image delete deletion
        if (deleteImages && Array.isArray(deleteImages)) {
            for (const imageId of deleteImages) {
                const postImage = await PostImage.findByPk(imageId);
                if (postImage && postImage.postId == (post.id).toString()) {
                    if (fs.existsSync(postImage.image)) {
                        fs.unlinkSync(postImage.image)
                    }
                    await postImage.destroy();
                }
            }
        }

        //Handle new image delete deletion
        let newImages: string[] = [];
        if (req.files && Array.isArray(req.files)) {
            newImages = (req.files as Express.Multer.File[]).map(file => file.path);

            if (newImages.length > 0) {
                const postImages = newImages.map(image => (
                    {
                        image,
                        postId: (post.id).toString()
                    }
                ));
                await PostImage.bulkCreate(postImages);
            }
        }

        //Update Post
        const updateData: any = [];
        if (title) {
            updateData.title = title;
            updateData.slug = slugify(title, { lower: true, strict: true });
        }
        if (content) updateData.content = content;

        await post.update(updateData);

        //Get updated post with images
        const updatedPost = await Post.findByPk(post.id, {
            include: [
                {
                    model: PostImage,
                    attributes: ['id', 'image']
                }
            ]
        });

        return res.json({
            'success': true,
            data: updatedPost
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update post"
        });
    }
}


export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const postId = req.params.id;
        
        const post = await Post.findByPk(postId);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        
        // Check ownership
        if (post.userId !== req.user!.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this post"
            });
        }
        
        // Get all images associated with the post
        const postImages = await PostImage.findAll({
            where: { postId: post.id }
        });
        
        // Delete image files from filesystem
        for (const image of postImages) {
            if (fs.existsSync(image.image)) {
                fs.unlinkSync(image.image);
            }
        }
        
        // Delete the post (cascade should handle PostImage deletion)
        await post.destroy();
        
        return res.json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete post"
        });
    }
}