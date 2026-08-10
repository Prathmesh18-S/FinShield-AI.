import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSetupRequired, setIsSetupRequired] = useState(false);
  
  // Cinematic states
  const [hasBooted, setHasBooted] = useState(false);
  const [postLoginTransitioning, setPostLoginTransitioning] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const setupResponse = await authService.getSetupStatus();
        setIsSetupRequired(setupResponse.data.data.isSetupRequired);

        const token = localStorage.getItem('finshield_token');
        const userData = localStorage.getItem('finshield_user');
        
        if (token && userData && !setupResponse.data.data.isSetupRequired) {
          try {
            setUser(JSON.parse(userData));
          } catch (e) {
            localStorage.removeItem('finshield_token');
            localStorage.removeItem('finshield_user');
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token, user: userData } = response.data.data;
      
      localStorage.setItem('finshield_token', token);
      localStorage.setItem('finshield_user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('finshield_token');
    localStorage.removeItem('finshield_user');
    setUser(null);
    window.location.href = '/login';
  };

  const completeSetup = () => {
    setIsSetupRequired(false);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    isSetupRequired,
    hasBooted,
    setHasBooted,
    postLoginTransitioning,
    setPostLoginTransitioning,
    login,
    logout,
    completeSetup
  };

  if (loading) {
    // Return absolutely nothing while React fetches initial API. 
    // The boot sequence will happen AFTER this resolves.
    return <div style={{ background: '#030712', width: '100vw', height: '100vh' }} />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
