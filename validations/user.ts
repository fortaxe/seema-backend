import { z } from 'zod';

export const createUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().min(10).max(10),
    message: z.string(),
    subject: z.string(),
});

export const editUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().min(10).max(128),
    message: z.string(),
    subject: z.string(),
});

export const deleteUserSchema = z.object({
    userId: z.string().length(24),
});