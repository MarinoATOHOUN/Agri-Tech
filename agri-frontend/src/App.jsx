// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant principal de l'application de gestion agricole.
 * 
 * Gère le routage, l'authentification et la structure générale
 * de l'application.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { utils } from './services/api';
import './App.css';

// Composants de pages
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Cultures from './components/Cultures';
import CultureForm from './components/CultureForm';
import Recoltes from './components/Recoltes';
import RecolteForm from './components/RecolteForm';
import Depenses from './components/Depenses';
import DepenseForm from './components/DepenseForm';
import Profil from './components/Profil';
import Historique from './components/Historique';
import Graphiques from './components/Graphiques';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification au chargement de l'application
    const checkAuth = () => {
      const authenticated = utils.isAuthenticated();
      const currentUser = utils.getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Composant pour protéger les routes privées
  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // Composant pour rediriger les utilisateurs connectés
  const PublicRoute = ({ children }) => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
  };

  // Fonction pour gérer la connexion
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-agri-light-gray">
        <Routes>
          {/* Routes publiques */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login onLogin={handleLogin} />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Routes privées avec Layout */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout user={user} onLogout={handleLogout}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/cultures" element={<Cultures />} />
                    <Route path="/cultures/nouveau" element={<CultureForm />} />
                    <Route path="/cultures/:id/modifier" element={<CultureForm />} />
                    <Route path="/recoltes" element={<Recoltes />} />
                    <Route path="/recoltes/nouveau" element={<RecolteForm />} />
                    <Route path="/recoltes/:id/modifier" element={<RecolteForm />} />
                    <Route path="/depenses" element={<Depenses />} />
                    <Route path="/depenses/nouveau" element={<DepenseForm />} />
                    <Route path="/depenses/:id/modifier" element={<DepenseForm />} />
                    <Route path="/historique" element={<Historique />} />
                    <Route path="/graphiques" element={<Graphiques />} />
                    <Route path="/profil" element={<Profil user={user} setUser={setUser} />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
