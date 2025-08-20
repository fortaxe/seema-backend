import Module from "../models/video";
import { Request, Response } from "express";
import {
  videosSchema,
  updateVideoSchema,
  deleteVideoSchema,
  deleteModuleSchema,
} from "../validations/video";
import { extractVideoId } from "../utilis/extractVideoId";

export const createVideo = async (req: Request, res: Response) => {
  try {
    const result = videosSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        });
    }

    const { videos } = result.data;

    const videosModel = videos.map((video) => {
      const videoId = extractVideoId(video.youTubeUrl);
      return {
        ...video,
        videoId,
      };
    });

    const newModel = new Module({
      videos: videosModel,
    });

    await newModel.save();

    return res.status(201).json({ data: newModel });
  } catch (error) {
    console.error("Error creating video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  try {
    const videos = await Module.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: videos });
  } catch (error) {
    console.error("Error getting videos:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getVideo = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const video = await Module.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    return res.status(200).json({ data: video });
  } catch (error) {
    console.error("Error getting video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;

    // validate input
    const result = updateVideoSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { videoId, title, description, youTubeUrl, thumbnail } = result.data;

    // Find module that contains this video
    const moduleDoc = await Module.findById(moduleId);
    if (!moduleDoc) {
      return res.status(404).json({ message: "Module with video not found" });
    }

    // Find the specific video subdocument
    const video = moduleDoc.videos.id(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }


    const newVideoId = extractVideoId(youTubeUrl);

    // Update fields
    video.title = title;
    video.description = description;
    video.youTubeUrl = youTubeUrl;
    video.thumbnail = thumbnail;
    video.videoId = newVideoId || "";
    // Save the module
    await moduleDoc.save();

    return res.status(200).json({ data: video });
  } catch (error) {
    console.error("Error updating video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const result = deleteVideoSchema.safeParse(req.body);

    if (!result.success) {
      res
        .status(400)
        .json({
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        });
      return;
    }

    const { moduleId, videoId } = result.data;

    const moduleDoc = await Module.findById(moduleId);

    if (!moduleDoc) {
      return res.status(404).json({ message: "Module not found" });
    }

    const video = moduleDoc.videos.id(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.deleteOne();

    await moduleDoc.save();
  } catch (error) {
    console.error("Error deleting video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addVideoToModule = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const { title, description, youTubeUrl, thumbnail } = req.body;

    // Validate input
    if (!title || !description || !youTubeUrl) {
      return res.status(400).json({ 
        message: "Title, description, and youTubeUrl are required" 
      });
    }

    // Find the module
    const moduleDoc = await Module.findById(moduleId);
    if (!moduleDoc) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Extract video ID from YouTube URL
    const videoId = extractVideoId(youTubeUrl);

    // Create new video object
    const newVideo = {
      title,
      description,
      youTubeUrl,
      thumbnail: thumbnail || "",
      videoId: videoId || "",
    };

    // Add video to module
    moduleDoc.videos.push(newVideo);
    await moduleDoc.save();

    // Return the newly added video
    const addedVideo = moduleDoc.videos[moduleDoc.videos.length - 1];
    return res.status(201).json({ data: addedVideo });
  } catch (error) {
    console.error("Error adding video to module:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const result = deleteModuleSchema.safeParse(req.body);

    if (!result.success) {
      res
        .status(400)
        .json({
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        });
      return;
    }

    const { moduleId } = result.data;

    const moduleDoc = await Module.findByIdAndDelete(moduleId);

    if (!moduleDoc) {
      res.status(404).json({ message: "Module not found" });
      return;
    }

    return res.status(200).json({ message: "Module deleted" });
  } catch (error) {
    console.error("Error deleting module:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
