import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Eye, EyeOff, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import CyberBackground from '../components/Auth/CyberBackground';

const buttonStates = [
  "Authenticating...",
  "Checking Credentials...",
  "Establishing Secure Session...",
  "Redirecting..."
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authPhase, setAuthPhase] = useState('idle'); // idle, authenticating, success
  const [loadingStep, setLoadingStep] = useState(0);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [shake, setShake] = useState(false); // For error animation
  
  const { login, setPostLoginTransitioning } = useAuth();

  const handleKeyUp = (e) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  // Handle the multi-step loading text animation
  useEffect(() => {
    if (authPhase === 'authenticating') {
      const interval = setInterval(() => {
        setLoadingStep(prev => (prev < buttonStates.length - 1 ? prev + 1 : prev));
      }, 600);
      return () => clearInterval(interval);
    }
  }, [authPhase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthPhase('authenticating');
    setLoadingStep(0);
    
    // Simulate slight network delay for cinematic effect
    await new Promise(r => setTimeout(r, 1500));
    const result = await login(email, password);
    
    if (result.success) {
      setAuthPhase('success');
      toast.success('Authentication successful');
      
      // Wait for success animation then trigger post-login transition
      setTimeout(() => {
        setPostLoginTransitioning(true);
      }, 1000);

    } else {
      setAuthPhase('idle');
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake state
      toast.error(result.message || 'Invalid credentials');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } }
  };

  return (
    <CyberBackground>
      <motion.div 
        className="glass-panel"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
          background: 'rgba(3, 7, 18, 0.6)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
              style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '1rem', borderRadius: '50%', border: '1px solid rgba(6, 182, 212, 0.3)', boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)' }}
            >
              <Shield size={32} color="var(--accent-cyan)" />
            </motion.div>
          </div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: 600, letterSpacing: '0.5px', color: '#fff' }}>
            FinShield<span style={{ color: 'var(--accent-cyan)' }}>-AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
            Authorized Personnel Only
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <motion.div 
            variants={itemVariants} 
            style={{ position: 'relative' }}
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Mail size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="email"
              placeholder="Official Email Address"
              required
              className="cinematic-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={authPhase !== 'idle'}
            />
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            style={{ position: 'relative' }}
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Lock size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Master Password"
              required
              className="cinematic-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={handleKeyUp}
              disabled={authPhase !== 'idle'}
              style={{ paddingRight: '2.5rem' }}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={authPhase !== 'idle'}
              style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>

          <AnimatePresence>
            {capsLockActive && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ color: 'var(--risk-medium)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}
              >
                ⚠️ Caps Lock is engaged
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--accent-cyan)' }} disabled={authPhase !== 'idle'} />
              Remember me
            </label>
            <a href="#" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); toast.error("Please contact your IT administrator to reset credentials."); }}>
              Forgot password?
            </a>
          </motion.div>

          <motion.button 
            variants={itemVariants}
            whileHover={authPhase === 'idle' ? { scale: 1.02 } : {}}
            whileTap={authPhase === 'idle' ? { scale: 0.98 } : {}}
            type="submit" 
            disabled={authPhase !== 'idle'}
            className="cinematic-btn"
            style={{
              background: authPhase === 'success' 
                ? 'var(--risk-normal)' 
                : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
              pointerEvents: authPhase !== 'idle' ? 'none' : 'auto'
            }}
          >
            <AnimatePresence mode="wait">
              {authPhase === 'idle' && (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Initialize Session
                </motion.span>
              )}
              {authPhase === 'authenticating' && (
                <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="radar-spinner" />
                  {buttonStates[loadingStep]}
                </motion.span>
              )}
              {authPhase === 'success' && (
                <motion.span key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} /> Access Granted
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
        
        <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', letterSpacing: '0.5px' }}>
          SECURE CONNECTION ESTABLISHED
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        .cinematic-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.5rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-family: inherit;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          outline: none;
        }
        .cinematic-input:focus {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
          background: rgba(0, 0, 0, 0.4);
        }
        .cinematic-input::placeholder {
          color: rgba(255,255,255,0.3);
        }
        .cinematic-input:disabled {
          opacity: 0.5;
        }
        .cinematic-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 8px;
          color: white;
          border: none;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 0.5rem;
          box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .radar-spinner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </CyberBackground>
  );
};

export default Login;
