import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

const bootSteps = [
  "Initializing Security Engine...",
  "Checking System Integrity...",
  "Connecting Secure Services...",
  "Authentication Portal Ready"
];

const BootSequence = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showScanner, setShowScanner] = useState(true);

  useEffect(() => {
    if (stepIndex < bootSteps.length - 1) {
      const timer = setTimeout(() => {
        setStepIndex(prev => prev + 1);
      }, 1200); // Wait 1.2s per step
      return () => clearTimeout(timer);
    } else {
      // Last step reached
      const timer = setTimeout(() => {
        setShowScanner(false);
        setTimeout(onComplete, 800); // Call onComplete after scanner fades
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem'
      }}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{ position: 'relative' }}>
          {/* Outer glow */}
          <motion.div 
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          <Shield size={64} color="var(--accent-cyan)" style={{ position: 'relative', zIndex: 1 }} />
          
          {/* Scanner Line */}
          <AnimatePresence>
            {showScanner && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{
                  position: 'absolute',
                  left: -10,
                  right: -10,
                  height: '2px',
                  background: 'var(--accent-cyan)',
                  boxShadow: '0 0 10px var(--accent-cyan)',
                  zIndex: 2
                }}
              />
            )}
          </AnimatePresence>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ margin: '1.5rem 0 0 0', fontSize: '2rem', letterSpacing: '0.1em', fontWeight: 300, color: '#fff' }}
        >
          FINSHIELD<span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>AI</span>
        </motion.h1>
      </motion.div>

      <div style={{ height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: stepIndex === bootSteps.length - 1 ? 'var(--accent-cyan)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {stepIndex < bootSteps.length - 1 && (
              <span className="blink-block" style={{ width: '8px', height: '14px', background: 'var(--accent-cyan)', display: 'inline-block' }} />
            )}
            {bootSteps[stepIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .blink-block { animation: blink 1s step-end infinite; }
      `}} />
    </motion.div>
  );
};

export default BootSequence;
