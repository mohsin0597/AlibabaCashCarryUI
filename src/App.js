import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './components/HomePage';
import AllOrdersPage from './components/AllOrdersPage';
import HomePage from './components/homePage';
import TodaysOrdersPage from './components/TodaysOrderPage';
import ClientDetailsPage from './components/ClientDetailsPage';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orders" element={<AllOrdersPage />} />
        <Route path="/todays-orders" element={<TodaysOrdersPage />} />
        <Route path="/client-details" element={<ClientDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;