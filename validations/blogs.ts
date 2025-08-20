import { z } from "zod";

export const createBlogSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.string().min(1),
});

export const updateBlogSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.string().min(1),
});

export const deleteBlogSchema = z.object({  
    blogId: z.string().length(24),
});