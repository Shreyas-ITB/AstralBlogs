import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import BlogGrid from '../components/BlogGrid';
import { BlogPost } from '../types';
import { motion } from 'framer-motion';
import { fetchPosts, searchPosts } from '../services/api';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    setIsSearching(true);
    setLoading(true);
    
    try {
      const results = await searchPosts(query);
      setPosts(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    if (isSearching) {
      setIsSearching(false);
      setSearchTerm('');
      setLoading(true);
      
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="pt-8 px-4 text-center">
          <motion.h1 
            className="text-5xl font-bold text-white mb-4"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            AstralBlogs
          </motion.h1>
          <motion.p 
            className="text-white text-lg font-medium max-w-2xl mx-auto illuminate"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Illuminating minds, one star at a time
          </motion.p>
        </div>
      </motion.div>

      <SearchBar onSearch={handleSearch} />

      {isSearching && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-300 text-sm">
              Showing results for: <span className="text-white font-medium">"{searchTerm}"</span>
            </p>
            <button 
              onClick={clearSearch}
              className="text-white hover:text-white-brighter text-sm illuminate"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <BlogGrid posts={posts} loading={loading} />
      </div>
      {/* <footer className="footer-stars fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl 
        bg-transparent backdrop-blur-md border border-white/30 
        rounded-xl shadow-[0_0_8px_rgba(255,255,255,0.2)] 
        text-white text-center py-3 px-6 z-50">
        <p className="text-sm text-white/80">
          <span className="block mb-1">
            <span className="font-semibold text-white">AstralBlogs</span> is your gateway to engaging blogs — from intriguing facts to compelling debates, it offers sharp insights and knowledge.
          </span>
          Made with <span className="text-pink-400">❤️</span> and affection — maintained by <span className="font-semibold text-white">Shreyas</span> & <span className="font-semibold text-white">Shreya</span>. © {new Date().getFullYear()} All rights reserved.
        </p>
      </footer> */}
      <Footer />
    </div>
  );
};

export default HomePage;