import { title } from "process";
import { z } from "zod";

export const videoSchema = z.object({
    title: z.string(),
    description: z.string(),
    youTubeUrl: z.string(),
    thumbnail: z.string(),
});


export const videosSchema = z.object({
    videos: z.array(videoSchema),
});

export const deleteVideoSchema = z.object({
    videoId: z.string().length(24),
    moduleId: z.string().length(24),
});


export const updateVideoSchema = z.object({
   
    videoId: z.string().length(24),
    title: z.string(),
    description: z.string(),
    youTubeUrl: z.string(),
    thumbnail: z.string(),
});

export const deleteModuleSchema = z.object({
    moduleId: z.string().length(24),
});
