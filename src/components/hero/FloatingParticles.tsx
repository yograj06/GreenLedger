import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  type: 'wheat' | 'leaf' | 'block';
  opacity: number;
}

const FloatingParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        id: i,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.2,
        type: ['wheat', 'leaf', 'block'][Math.floor(Math.random() * 3)] as Particle['type'],
        opacity: Math.random() * 0.6 + 0.2,
      });
    }
    particlesRef.current = particles;

    // Animation loop
    const animate = () => {
      particlesRef.current.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += Math.sin(Date.now() * 0.001 + particle.id) * 0.1;

        if (particle.y < -10) {
          particle.y = rect.height + 10;
          particle.x = Math.random() * rect.width;
        }
      });

      if (containerRef.current) {
        containerRef.current.style.setProperty('--particles-data', JSON.stringify(particlesRef.current));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getParticleIcon = (type: Particle['type']) => {
    switch (type) {
      case 'wheat':
        return '🌾';
      case 'leaf':
        return '🍃';
      case 'block':
        return '⛓️';
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {particlesRef.current.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-primary/30 select-none"
          style={{
            left: particle.x,
            top: particle.y,
            fontSize: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            y: [particle.y, particle.y - 100],
            x: [particle.x, particle.x + Math.sin(Date.now() * 0.001) * 20],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {getParticleIcon(particle.type)}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingParticles;