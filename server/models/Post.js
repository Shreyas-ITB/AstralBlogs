import { s } from 'framer-motion/client';
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true
  },
  links: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add text index for search functionality
PostSchema.index({ title: 'text', shortDescription: 'text' });

const Post = mongoose.model('Post', PostSchema);

export default Post;