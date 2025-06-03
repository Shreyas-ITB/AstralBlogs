import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface LinkCardProps {
  url: string;
  index: number;
}

interface AmazonProduct {
  title: string;
  image: string;
  price: string;
}

// Simple in-memory cache
const productCache: Record<string, AmazonProduct> = {};

const LinkCard: React.FC<LinkCardProps> = ({ url, index }) => {
  const [productInfo, setProductInfo] = useState<AmazonProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductInfo = async () => {
      if (!url.includes('amzn')) {
        setLoading(false);
        return;
      }

      // Use cache if available
      if (productCache[url]) {
        setProductInfo(productCache[url]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/amazon-product?url=${encodeURIComponent(url)}`);
        productCache[url] = response.data;
        setProductInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch product info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductInfo();
  }, [url]);

  // Extract domain name
  let domain = '';
  try {
    domain = new URL(url).hostname.replace('www.', '');
  } catch (e) {
    domain = url;
  }

  const isAmazon = domain.includes('amazon') || domain.includes('amzn');

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="link-card block rounded-lg p-4 mb-4 animate-pulse"
      >
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-purple-600/30 rounded-md"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-purple-600/30 rounded w-3/4"></div>
            <div className="h-4 bg-purple-600/30 rounded w-1/2"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isAmazon && productInfo) {
    return (
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-card block rounded-lg p-4 mb-4 hover:scale-[1.02] transition-transform duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <div className="flex items-center space-x-4">
          <img
            src={productInfo.image}
            alt={productInfo.title}
            className="w-24 h-24 object-contain rounded-2xl bg-white/10 p-2 shadow-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/96';
            }}
          />
          <div className="flex-1">
            <h3 className="text-white font-medium line-clamp-2">{productInfo.title}</h3>
            <p className="text-purple-300 font-bold mt-2 hover:text-white transition-colors duration-300 ease-out">View Current Price →</p>
          </div>
        </div>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-card block rounded-lg p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-md flex items-center justify-center mr-4">
          <span className="font-bold">{domain.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-grow">
          <h3 className="text-white font-medium">Product Links</h3>
          <p className="text-purple-300 text-sm truncate">{domain}</p>
        </div>
        <ExternalLink className="flex-shrink-0 ml-2 text-purple-400 w-5 h-5" />
      </div>
    </motion.a>
  );
};

export default LinkCard;
