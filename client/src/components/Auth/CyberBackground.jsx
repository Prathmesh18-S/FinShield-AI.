import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CyberBackground = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  
  // Generate random static nodes for the background graph once
  useEffect(() => {
    const newNodes = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setNodes(newNodes);
  }, []);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#030712', // deep slate/black
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff'
    }}>
      
      {/* Deep Ambient Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(6,182,212,0.03) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(100px)' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.03) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(100px)' }} />
      
      {/* Grid Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />

      {/* SVG Particle Network */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.4 }}>
        {nodes.map((node, i) => {
          // Connect to next 2 nodes to create a subtle web
          const target1 = nodes[(i + 1) % nodes.length];
          const target2 = nodes[(i + 2) % nodes.length];
          
          return (
            <g key={node.id}>
              {/* Lines */}
              <motion.line
                x1={`${node.x}%`} y1={`${node.y}%`}
                x2={`${target1.x}%`} y2={`${target1.y}%`}
                stroke="rgba(6, 182, 212, 0.15)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: node.duration, repeat: Infinity, repeatType: "reverse", ease: "linear", delay: node.delay }}
              />
              <motion.line
                x1={`${node.x}%`} y1={`${node.y}%`}
                x2={`${target2.x}%`} y2={`${target2.y}%`}
                stroke="rgba(139, 92, 246, 0.1)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: node.duration * 1.5, repeat: Infinity, repeatType: "reverse", ease: "linear", delay: node.delay }}
              />
              {/* Dots */}
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.size}
                fill="rgba(6, 182, 212, 0.5)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
                transition={{ duration: node.duration / 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: node.delay }}
              />
            </g>
          );
        })}
      </svg>

      {/* Vignette to darken edges and focus center */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(3, 7, 18, 0.8) 100%)', pointerEvents: 'none' }} />

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {children}
      </div>

    </div>
  );
};

export default CyberBackground;
