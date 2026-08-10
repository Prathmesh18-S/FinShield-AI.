import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Building, User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import CyberBackground from '../components/Auth/CyberBackground';

const Setup = () => {
  const { completeSetup } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', organization: '', email: '', password: '', confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleKeyUp = (e) => {
    setCapsLockActive(e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (formData.password.length < 8) return toast.error('Password must be at least 8 characters');

    setIsSubmitting(true);

    try {
      // Small artificial delay for dramatic effect
      await new Promise(r => setTimeout(r, 1000));
      await authService.setupFirstAdmin(formData);
      setIsSuccess(true);
      toast.success('Security core initialized.');
      
      setTimeout(() => completeSetup(), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initialize engine');
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, type: "spring" } }
  };

  return (
    <CyberBackground>
      <motion.div 
        className="glass-panel"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%', maxWidth: '500px', padding: '2.5rem', position: 'relative', zIndex: 1,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
          background: 'rgba(3, 7, 18, 0.6)', backdropFilter: 'blur(20px)'
        }}
      >
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring" }}
              style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '50%', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' }}
            >
              <Shield size={32} color="var(--accent-purple)" />
            </motion.div>
          </div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: 600, color: '#fff' }}>Initialize Core</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>Create the root administrator to unlock platform.</p>
        </motion.div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.div variants={itemVariants} style={{ flex: 1, position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" name="firstName" placeholder="First Name" required className="cinematic-input" value={formData.firstName} onChange={handleInputChange} disabled={isSubmitting || isSuccess} style={{ paddingLeft: '2.5rem' }} />
            </motion.div>
            <motion.div variants={itemVariants} style={{ flex: 1 }}>
              <input type="text" name="lastName" placeholder="Last Name" required className="cinematic-input" value={formData.lastName} onChange={handleInputChange} disabled={isSubmitting || isSuccess} />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} style={{ position: 'relative' }}>
            <Building size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" name="organization" placeholder="Organization" required className="cinematic-input" value={formData.organization} onChange={handleInputChange} disabled={isSubmitting || isSuccess} style={{ paddingLeft: '2.5rem' }} />
          </motion.div>

          <motion.div variants={itemVariants} style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="email" name="email" placeholder="Official Email" required className="cinematic-input" value={formData.email} onChange={handleInputChange} disabled={isSubmitting || isSuccess} style={{ paddingLeft: '2.5rem' }} />
          </motion.div>

          <motion.div variants={itemVariants} style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Master Password" required className="cinematic-input" value={formData.password} onChange={handleInputChange} onKeyUp={handleKeyUp} disabled={isSubmitting || isSuccess} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isSubmitting || isSuccess} style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>

          <motion.div variants={itemVariants} style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" required className="cinematic-input" value={formData.confirmPassword} onChange={handleInputChange} onKeyUp={handleKeyUp} disabled={isSubmitting || isSuccess} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isSubmitting || isSuccess} style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </motion.div>

          <AnimatePresence>
            {capsLockActive && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ color: 'var(--risk-medium)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                ⚠️ Caps Lock is engaged
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            variants={itemVariants} whileHover={!isSubmitting && !isSuccess ? { scale: 1.02 } : {}} whileTap={!isSubmitting && !isSuccess ? { scale: 0.98 } : {}}
            type="submit" disabled={isSubmitting || isSuccess} className="cinematic-btn"
            style={{ background: isSuccess ? 'var(--risk-normal)' : 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))' }}
          >
            <AnimatePresence mode="wait">
              {!isSubmitting && !isSuccess && <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Establish Secure Root</motion.span>}
              {isSubmitting && <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className="radar-spinner" /> Validating Identity...</motion.span>}
              {isSuccess && <motion.span key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} /> Engine Initialized</motion.span>}
            </AnimatePresence>
          </motion.button>
        </form>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        .cinematic-input {
          width: 100%; padding: 0.875rem 1rem; border-radius: 8px;
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff; font-family: inherit; font-size: 0.875rem; transition: all 0.3s ease; outline: none;
        }
        .cinematic-input:focus { border-color: var(--accent-purple); box-shadow: 0 0 15px rgba(139, 92, 246, 0.2); background: rgba(0, 0, 0, 0.4); }
        .cinematic-input::placeholder { color: rgba(255,255,255,0.3); }
        .cinematic-input:disabled { opacity: 0.5; }
        .cinematic-btn {
          width: 100%; padding: 1rem; border-radius: 8px; color: white; border: none; font-weight: 600; font-size: 0.95rem;
          cursor: pointer; display: flex; justify-content: center; align-items: center; margin-top: 0.5rem;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3); position: relative; overflow: hidden;
        }
        .cinematic-btn:disabled { cursor: not-allowed; }
        .radar-spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff; animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </CyberBackground>
  );
};

export default Setup;
