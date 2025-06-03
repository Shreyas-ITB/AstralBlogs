import React from 'react';
import BlogCard from './BlogCard';
import { BlogPost } from '../types';

interface BlogGridProps {
  posts: BlogPost[];
  loading: boolean;
}

const BlogGrid: React.FC<BlogGridProps> = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="loader text-purple-500">
          <div className="w-12 h-12 border-4 border-t-purple-500 border-r-transparent border-b-purple-300 border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full text-center py-20">
        <h3 className="text-2xl font-medium text-white mb-2">No posts found</h3>
        <p className="text-gray-300">Try searching for something else</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {posts.map((post, index) => (
        <BlogCard key={post._id} post={post} index={index} />
      ))}
    </div>
  );
};

export default BlogGrid;