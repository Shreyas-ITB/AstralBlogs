import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStars();
    };

    const generateStars = () => {
      const stars: Star[] = [];
      const count = Math.floor((canvas.width * canvas.height) / 3000); // Increased density back to original
      
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5, // Back to original smaller size (0.5-2.5px)
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.01 + 0.002 // Even slower twinkling
        });
      }
      
      starsRef.current = stars;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate elastic movement based on mouse position
      const mouseXRatio = (mouseRef.current.x / canvas.width - 0.5) * 2;
      const mouseYRatio = (mouseRef.current.y / canvas.height - 0.5) * 2;
      const offsetX = mouseXRatio * 20; // Keep the same movement range
      const offsetY = mouseYRatio * 20;
      
      starsRef.current.forEach(star => {
        // Draw the star with glow effect
        const twinkle = Math.sin(Date.now() * star.speed) * 0.2 + 0.8; // Reduced twinkling intensity further
        const radius = star.size * twinkle;
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          star.x + offsetX,
          star.y + offsetY,
          0,
          star.x + offsetX,
          star.y + offsetY,
          radius * 2
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * twinkle})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${star.opacity * twinkle * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(star.x + offsetX, star.y + offsetY, radius * 2, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-[-1] night-bg"
    />
  );
};

export default StarBackground;