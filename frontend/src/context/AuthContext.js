// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('username');
    const isAuthCompleted = localStorage.getItem('isAuthCompleted')
    if (storedToken && storedUser && isAuthCompleted) {
      setAuth({
        isAuthenticated: true,
        user: storedUser,
        token: storedToken,
      });
    }
  }, []);

  const login = (username, token,user_role) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('username', username);
    localStorage.setItem('isAuthCompleted', true)
    localStorage.setItem('role', user_role)
    setAuth({
      isAuthenticated: true,
      user: username,
      token,
      user_role
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('isAuthCompleted')
    localStorage.removeItem('role')
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
