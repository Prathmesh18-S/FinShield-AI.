import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

// Components
import Layout from './components/Layout/Layout';
import BootSequence from './components/Auth/BootSequence';
import CyberBackground from './components/Auth/CyberBackground';
import AuthTransition from './components/Auth/AuthTransition';
import Login from './pages/Login';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Upload from './pages/Upload';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isSetupRequired, postLoginTransitioning, setPostLoginTransitioning } = useAuth();
  
  if (isSetupRequired) return <Navigate to="/setup" replace />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (postLoginTransitioning) {
    return (
      <CyberBackground>
        <AuthTransition onComplete={() => setPostLoginTransitioning(false)} />
      </CyberBackground>
    );
  }

  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }) => {
  const { isSetupRequired, isAuthenticated } = useAuth();
  if (isSetupRequired) return <Navigate to="/setup" replace />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const SetupRoute = ({ children }) => {
  const { isSetupRequired } = useAuth();
  if (!isSetupRequired) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
  const { hasBooted, setHasBooted } = useAuth();

  if (!hasBooted) {
    return (
      <CyberBackground>
        <AnimatePresence mode="wait">
          <BootSequence onComplete={() => setHasBooted(true)} />
        </AnimatePresence>
      </CyberBackground>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          },
          success: { iconTheme: { primary: 'var(--accent-cyan)', secondary: '#030712' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
        }} 
      />
      <Router>
        <Routes>
          <Route path="/setup" element={<SetupRoute><Setup /></SetupRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
