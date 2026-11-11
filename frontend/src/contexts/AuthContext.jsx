import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiUrl } from '../lib/apiConfig';

// Create Context
const AuthContext = createContext(null);

// Custom Hook for easy usage
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);

  // The login and CMS now share the same configured backend URL.

  // Check token validity on app load
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(apiUrl("/auth/me"), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 401 || response.status === 403) {
          // A confirmed invalid or expired token is safe to clear.
          logout();
        } else {
          // A transient 5xx is not proof that a valid session is invalid.
          setUser(null);
        }
      } catch (error) {
        // A temporary network or cold-start failure must not erase a valid session.
        // Server-side authorization still protects every admin endpoint.
        console.warn("Authentication service could not be reached");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]); 

  const login = async (email, password) => {
    const response = await fetch(apiUrl("/auth/login"), {
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
    const response = await fetch(apiUrl("/auth/register"), {
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
