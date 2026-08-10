import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Activity, Database, Server } from 'lucide-react';

const transitionSteps = [
  { text: "Access Granted", icon: ShieldCheck, color: "var(--accent-cyan)" },
  { text: "Decrypting Environment...", icon: Lock, color: "var(--accent-purple)" },
  { text: "Loading Threat Intelligence...", icon: Database, color: "var(--accent-blue)" },
  { text: "Initializing Risk Engine...", icon: Activity, color: "var(--risk-high)" },
  { text: "Establishing Secure Connection...", icon: Server, color: "var(--risk-normal)" }
];

const AuthTransition = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < transitionSteps.length - 1) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 900); // 900ms per step
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  const CurrentIcon = transitionSteps[step].icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.5 } }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)', transition: { duration: 0.3 } }}
          transition={{ duration: 0.4, type: "spring" }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
        >
          <div style={{ 
            background: `rgba(${transitionSteps[step].color.match(/\d+/g)?.join(',') || '255,255,255'}, 0.05)`, 
            padding: '1.5rem', 
            borderRadius: '50%',
            border: `1px solid ${transitionSteps[step].color}`,
            boxShadow: `0 0 30px ${transitionSteps[step].color}40`,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <CurrentIcon size={48} color={transitionSteps[step].color} />
          </div>

          <h2 style={{ 
            fontFamily: 'monospace', 
            fontSize: '1.25rem', 
            color: '#fff',
            margin: 0,
            letterSpacing: '1px'
          }}>
            {transitionSteps[step].text}
          </h2>
          
          {/* Progress Bar */}
          <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', borderRadius: '2px' }}>
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.9, ease: "linear" }}
              style={{ height: '100%', background: transitionSteps[step].color }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AuthTransition;
