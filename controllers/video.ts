import Video from "../models/video";
import Category from "../models/category";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createVideo = async (req: Request, res: Response) => {
  try {
    const { title, description, category, videoUrl, thumbnailUrl, fileSize, duration } = req.body;
    

    // Validate required fields
    if (!title || !description || !category || !videoUrl) {
      return res.status(400).json({ 
        message: "Title, description, category, videoUrl, and user authentication are required" 
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const newVideo = new Video({
      title: title.trim(),
      description,
      category,
      videoUrl,
      thumbnailUrl,
      fileSize,
      duration,
     
    });

    await newVideo.save();

    // Populate category details
    await newVideo.populate('category', 'name');


    return res.status(201).json({ 
      message: "Video created successfully",
      data: newVideo 
    });
  } catch (error) {
    console.error("Error creating video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  try {
    const { category, active } = req.query;
    
    const filter: any = {};
    if (category) {
      filter.category = category;
    }
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }

    const videos = await Video.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json({ 
      data: videos
    });
  } catch (error) {
    console.error("Error getting videos:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getVideo = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await Video.findById(videoId)
      .populate('category', 'name')
     
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
    const { videoId } = req.params;
    const { title, description, category, videoUrl, thumbnailUrl, fileSize, duration, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Validate category if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
    }

    // Update fields
    if (title) video.title = title.trim();
    if (description !== undefined) video.description = description;
    if (category) video.category = category;
    if (videoUrl) video.videoUrl = videoUrl;
    if (thumbnailUrl !== undefined) video.thumbnailUrl = thumbnailUrl;
    if (fileSize !== undefined) video.fileSize = fileSize;
    if (duration !== undefined) video.duration = duration;
    if (isActive !== undefined) video.isActive = isActive;

    await video.save();

    // Populate category details
    await video.populate('category', 'name');
   

    return res.status(200).json({ 
      message: "Video updated successfully",
      data: video 
    });
  } catch (error) {
    console.error("Error updating video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    await Video.findByIdAndDelete(videoId);

    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get videos by category
export const getVideosByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const videos = await Video.find({ category: categoryId, isActive: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json({ 
      data: videos
    });
  } catch (error) {
    console.error("Error getting videos by category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
