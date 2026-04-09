import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Context
const AuthContext = createContext(null);

// Custom Hook for easy usage
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);

  // FIXED: Hardcoded live Render URL so it never tries to use localhost on Vercel
  const API_BASE_URL = 'https://mahamanamalviyamissionbiharunit.onrender.com';

  // Check token validity on app load
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token is invalid/expired
          logout();
        }
      } catch (error) {
        console.error("Auth verification failed", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]); 

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('access_token', data.access_token);
    return data.user;
  };

  const register = async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // The backend forces the "client" role automatically for security
      body: JSON.stringify({ name, email, password }) 
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Handle FastAPI validation errors smoothly
      const errorMessage = Array.isArray(errorData.detail) 
        ? errorData.detail[0].msg 
        : errorData.detail;
      throw new Error(errorMessage || 'Registration failed');
    }

    // Auto-login after successful registration
    return await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
