import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  fileSize: {
    type: Number
  },
  duration: {
    type: Number // Duration in seconds
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Add index for better query performance
videoSchema.index({ category: 1, isActive: 1 });
videoSchema.index({ createdAt: -1 });

export default mongoose.model("Video", videoSchema);
