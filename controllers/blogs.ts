import { Request, Response } from "express";
import Blog from "../models/blog";
import { createBlogSchema, updateBlogSchema, deleteBlogSchema } from "../validations/blogs";
import { createSlugFromTitle } from "../utilis/create-slug";

export const createBlog = async (req: Request, res: Response) => {
    try {
        const result = createBlogSchema.safeParse(req.body);

        if (!result.success) {
             res.status(400).json({ message: "Invalid input", errors: result.error.flatten().fieldErrors });
             return
        }
    

    const { title, description, image } = result.data;

    const slug = createSlugFromTitle(title);

    const blog = await Blog.create({ title, description, image , slug});

     res.status(201).json({ data: blog });
     return
} catch (error) {
    console.error("Error creating blog:", error);
     res.status(500).json({ message: "Internal server error" });
     return
}
} 

export const getBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({ data: blogs });
        return
    } catch (error) {
        console.error("Error getting blogs:", error);
        res.status(500).json({ message: "Internal server error" });
        return
    }
}

export const getBlog = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);
        res.status(200).json({ data: blog });
        return
    } catch (error) {
        console.error("Error getting blog:", error);
        res.status(500).json({ message: "Internal server error" });
        return
    }
}

export const updateBlog = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const result = updateBlogSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: "Invalid input", errors: result.error.flatten().fieldErrors });
            return
        }

        const { title, description, image } = result.data;

        const slug = createSlugFromTitle(title);

        const blog = await Blog.findByIdAndUpdate(blogId, { title, description, image, slug }, { new: true });

            res.status(200).json({ data: blog });
        return
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ message: "Internal server error" });
        return
    }
}

export const deleteBlog = async (req: Request, res: Response) => {
    try {
       
        const result = deleteBlogSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: "Invalid input", errors: result.error.flatten().fieldErrors });
            return
        }

        const { blogId } = result.data;

        const blog = await Blog.findByIdAndDelete(blogId);

        res.status(200).json({ data: blog });
        return
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ message: "Internal server error" });
        return
    }
}