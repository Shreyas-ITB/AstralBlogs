import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrollbar, setHasScrollbar] = useState(false);

  useEffect(() => {
    const checkScrollbar = () => {
      const hasVerticalScrollbar = document.documentElement.scrollHeight > window.innerHeight;
      setHasScrollbar(hasVerticalScrollbar);
      
      if (!hasVerticalScrollbar) {
        setIsVisible(true);
        return;
      }

      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const threshold = 50; // pixels from bottom
      setIsVisible(documentHeight - scrollPosition <= threshold);
    };

    // Initial check
    checkScrollbar();

    // Check on scroll
    window.addEventListener('scroll', checkScrollbar);
    // Check on resize
    window.addEventListener('resize', checkScrollbar);

    return () => {
      window.removeEventListener('scroll', checkScrollbar);
      window.removeEventListener('resize', checkScrollbar);
    };
  }, []);

  return (
    <footer 
      className={`footer-stars fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl 
        bg-transparent backdrop-blur-md border border-white/30 
        rounded-xl shadow-[0_0_8px_rgba(255,255,255,0.2)] 
        text-white text-center py-3 px-6 z-50
        transition-all duration-700 ease-in-out
        ${(!hasScrollbar || isVisible) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <p className="text-sm text-white/80">
        <span className="block mb-1">
          <span className="font-semibold text-white">AstralBlogs</span> is your gateway to engaging blogs — from intriguing facts to compelling debates, it offers sharp insights and knowledge.
        </span>
        Made with <span className="text-pink-400">❤️</span> and affection — maintained by <span className="font-semibold text-white">Shreyas</span> & <span className="font-semibold text-white">Shreya</span>. © {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;