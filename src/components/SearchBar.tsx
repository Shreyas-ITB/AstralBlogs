import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto px-4 mt-6"
      ref={searchBarRef}
    >
      <form 
        onSubmit={handleSubmit}
        className={`search-bar bg-black/60 backdrop-blur-md text-white rounded-lg 
          px-4 py-2 flex items-center ${isFocused ? 'ring-2 ring-[#2e22ac]' : ''}`}
      >
        <Search className="w-4 h-4 text-[#2e22ac]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search blog posts..."
          className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 text-sm text-white placeholder-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-[#2e22ac] hover:bg-[#3d30c7] text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
        >
          Search
        </motion.button>
      </form>
    </motion.div>
  );
}

export default SearchBar