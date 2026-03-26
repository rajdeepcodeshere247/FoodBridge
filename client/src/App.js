import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import { LocationProvider } from './context/LocationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppRoutes() {
  const route = useLocation();

  return (
    <main key={route.pathname} className="fb-main fb-route-enter">
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
  );
}

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <Navbar />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          <AppRoutes />
          <Footer />
        </Router>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;