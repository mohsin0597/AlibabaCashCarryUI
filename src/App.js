import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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