// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  const login = async (username, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setIsAuth(true);
  };

  // --- ADD THIS NEW FUNCTION ---
  const register = async (username, password) => {
    // This will create the user
    await axios.post('http://localhost:5000/api/auth/register', { username, password });
    
    // After registering, immediately log them in
    await login(username, password);
  };
  // ------------------------------

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuth(false);
  };

  return (
    // --- ADD register TO THE VALUE ---
    <AuthContext.Provider value={{ token, isAuth, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};