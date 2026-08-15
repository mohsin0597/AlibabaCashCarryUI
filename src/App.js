import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import AllOrdersPage from './components/AllOrdersPage';
import HomePage from './components/homePage';
import TodaysOrdersPage from './components/TodaysOrderPage';
import ClientDetailsPage from './components/ClientDetailsPage';
import LoginPage from './components/LoginPage';

const isAuthenticated = () => {
  return !!localStorage.getItem("authToken"); // example: check if token exists
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      {/* <Alert
        severity="warning"
        sx={{
          mb: 2,
          justifyContent: 'center',
          animation: 'flash 1.5s ease-in-out infinite',
          '@keyframes flash': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.2 }
          }
        }}
      >
        AliBabaCashCarry.com is expiring on 13/08/2026
      </Alert> */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AllOrdersPage />
            </ProtectedRoute> 
          }
        />
        <Route
          path="/todays-orders"
          element={
            <ProtectedRoute>
              <TodaysOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-details"
          element={
            <ProtectedRoute>
              <ClientDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;