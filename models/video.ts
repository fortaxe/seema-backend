import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  youTubeUrl: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const moduleSchema = new mongoose.Schema({
  videos: [videoSchema],
}, { timestamps: true });

export default mongoose.model("Module", moduleSchema);
