// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppNavbar from './components/AppNavbar';
import HomePage from './components/HomePage'; // We will create this
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard'; // We will create this
import ProtectedRoute from './components/ProtectedRoute'; // We will create this

function App() {
  return (
    <AuthProvider>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;