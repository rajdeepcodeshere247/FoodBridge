import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import FoodListPage from './pages/FoodListPage';
import FoodDetailPage from './pages/FoodDetailPage';
import AddFoodPage from './pages/AddFoodPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="fb-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/foods" element={<FoodListPage />} />
            <Route path="/foods/:id" element={<FoodDetailPage />} />
            <Route path="/add-food" element={<ProtectedRoute><AddFoodPage /></ProtectedRoute>} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
