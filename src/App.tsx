import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CaregiverAuth from './components/caregiver/CaregiverAuth';
import CaregiverRegistration from './components/caregiver/CaregiverRegistration';
import CaregiverDashboard from './components/caregiver/CaregiverDashboard';
import CustomerAuth from './components/customer/CustomerAuth';
import CustomerDashboard from './components/customer/CustomerDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function AppContent() {
  const { user, userType } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/caregiver/auth" element={<CaregiverAuth />} />
        <Route path="/caregiver/register" element={<CaregiverRegistration />} />
        <Route 
          path="/caregiver/dashboard" 
          element={
            user && userType === 'caregiver' ? 
            <CaregiverDashboard /> : 
            <Navigate to="/caregiver/auth" />
          } 
        />
        <Route path="/customer/auth" element={<CustomerAuth />} />
        <Route 
          path="/customer/dashboard" 
          element={
            user && userType === 'customer' ? 
            <CustomerDashboard /> : 
            <Navigate to="/customer/auth" />
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;