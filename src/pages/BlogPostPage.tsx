import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import LinkCard from '../components/LinkCard';
import { BlogPost } from '../types';
import { fetchPostById } from '../services/api';
import Footer from '../components/Footer';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFooter, setShowFooter] = useState(false);

  const estimateReadingTime = (text: string, wpm: number = 225): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
};

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await fetchPostById(id);
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;
      setShowFooter(scrollY + windowHeight >= fullHeight - 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const renderContent = () => {
    if (!post || !post.content) return { content: null, leftoverLinks: [] };

    const sentences = post.content.split('.').map(s => s.trim()).filter(Boolean);
    const contentImages = post.images.slice(1); // First image is the thumbnail
    const productLinks = post.links || [];
    const paragraphSize = 4;

    const result: JSX.Element[] = [];
    let imageIndex = 0;
    let linkIndex = 0;

    for (let i = 0; i < sentences.length; i += paragraphSize) {
      const chunk = sentences.slice(i, i + paragraphSize);
      const paragraph = chunk.join('. ') + '.';

      result.push(
        <p key={`para-${i}`} className="mb-6 text-white leading-relaxed text-base md:text-lg lg:text-xl">
          {paragraph}
        </p>
      );

      const shouldInsertImage = Math.random() < 0.4 && imageIndex < contentImages.length;

      if (shouldInsertImage) {
        const currentImageIndex = imageIndex;
        const imageLinks: string[] = [];

        while (linkIndex < productLinks.length && imageLinks.length < 5) {
          imageLinks.push(productLinks[linkIndex]);
          linkIndex++;
        }

        result.push(
          <div key={`img-${i}`} className="my-8">
            <img
              src={contentImages[currentImageIndex]}
              alt={`Blog image ${currentImageIndex + 1}`}
              className="rounded-lg w-full max-w-3xl mx-auto shadow-lg mb-4"
            />

            {imageLinks.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-white mb-4">Product Links</h3>
                <div className="space-y-4">
                  {imageLinks.map((link, linkIdx) => (
                    <LinkCard key={`link-${i}-${linkIdx}`} url={link} index={linkIdx} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

        imageIndex++;
      }
    }

    const leftoverLinks = productLinks.slice(linkIndex);
    return { content: result, leftoverLinks };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-purple-300 border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <Link to="/" className="text-purple-400 hover:text-purple-300 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
      </div>
    );
  }

  const { content, leftoverLinks } = renderContent();

  return (
    <div className="min-h-screen pb-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 pt-8"
      >
        <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all posts
        </Link>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center text-purple-300 text-sm mb-8">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formatDate(post.createdAt)}</span>
          {post.content && (
            <>
              <span className="mx-2">•</span>
              <span>{estimateReadingTime(post.content)} min read</span>
            </>
          )}
        </div>
          {post.images.length > 0 && (
            <div className="mb-8">
              <img src={post.images[0]} alt={post.title} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
          )}

          <div className="prose prose-lg prose-invert max-w-none text-white illuminated">{content}</div>

          {leftoverLinks.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-white mb-4">Product Links</h3>
              <div className="space-y-4">
                {leftoverLinks.map((link, index) => (
                  <LinkCard key={`final-link-${index}`} url={link} index={index} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
