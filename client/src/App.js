import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// TODO: Import pages as you build them
// import HomePage from './pages/HomePage';
// import DashboardPage from './pages/DashboardPage';
// import FoodListPage from './pages/FoodListPage';
// import FoodDetailPage from './pages/FoodDetailPage';
// import AddFoodPage from './pages/AddFoodPage';
// import MapPage from './pages/MapPage';
// import ProfilePage from './pages/ProfilePage';
// import LoginPage from './pages/LoginPage';

// TODO: Import context providers
// import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    // <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<div style={{padding:40}}><h1>🌉 FoodBridge</h1><p>Setup complete. Start building your pages!</p></div>} />
          {/* TODO: Add routes for each page */}
        </Routes>
      </Router>
    // </AuthProvider>
  );
}

export default App;
