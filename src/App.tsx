import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPostPage from './pages/BlogPostPage';
import StarBackground from './components/StarBackground';
import { ParallaxProvider } from 'react-scroll-parallax';

function App() {
  return (
    <ParallaxProvider>
      <Router>
        <div className="relative min-h-screen overflow-hidden">
          <StarBackground />
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:id" element={<BlogPostPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ParallaxProvider>
  );
}

export default App;