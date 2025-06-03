import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

// Utility to estimate reading time
const estimateReadingTime = (text: string) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const BlogCard: React.FC<BlogCardProps> = ({ post, index }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const readingTime = post.content ? estimateReadingTime(post.content) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link to={`/post/${post._id}`} className="block">
        <div className="blog-card rounded-lg overflow-hidden h-full">
          <div className="relative w-full h-48 overflow-hidden">
            <img 
              src={post.images?.[0] || 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg'} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          <div className="p-5">
            <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">{post.title}</h2>
            <p className="text-gray-300 text-sm mb-3 line-clamp-3">{post.shortDescription}</p>

            <div className="flex items-center text-purple-300 text-xs">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formattedDate}</span>
              {readingTime > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <span>{readingTime} min read</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
