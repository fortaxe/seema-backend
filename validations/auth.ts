import { z } from 'zod';

export const createAdminSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(128),
});

export const editAdminSchema = z.object({
    newEmail: z.string().email(),
    newPassword: z.string().min(6).max(128),
    confirmPassword: z.string().min(6).max(128),
});