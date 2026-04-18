// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
/**
 * Composant Layout pour la structure générale de l'application.
 * 
 * Inclut la navigation, le header et le footer.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Sprout,
  Package,
  DollarSign,
  BarChart3,
  History,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Sparkles as SparklesIcon,
  CreditCard,
  LifeBuoy,
  ShoppingBag,
  BrainCircuit
} from 'lucide-react';
import { authService, conseilService } from '../services/api';
import { Button } from '@/components/ui/button';
import Chatbot from './Chatbot';

const Layout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await conseilService.getAll({ lu: false });
        const notifications = data.results || data;
        setUnreadCount(notifications.length);
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de notifications:', error);
      }
    };

    if (user) {
      fetchUnreadCount();
      // Rafraîchir toutes les 5 minutes
      const interval = setInterval(fetchUnreadCount, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, location.pathname]);

  // Navigation items
  const navigationItems = [
    { name: 'Tableau de bord', href: '/dashboard', icon: Home },
    { name: 'Cultures', href: '/cultures', icon: Sprout },
    { name: 'Récoltes', href: '/recoltes', icon: Package },
    { name: 'Dépenses', href: '/depenses', icon: DollarSign },
    { name: 'Graphiques', href: '/graphiques', icon: BarChart3 },
    { name: 'Rapports IA', href: '/rapports', icon: SparklesIcon },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Abonnement', href: '/abonnement', icon: CreditCard },
    { name: 'Annonces', href: '/marketplace', icon: ShoppingBag },
    { name: 'IA Lab', href: '/ia', icon: BrainCircuit },
    { name: 'Support', href: '/support', icon: LifeBuoy },
    { name: 'Historique', href: '/historique', icon: History },
    { name: 'Profil', href: '/profil', icon: User },
  ];

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Forcer la déconnexion même en cas d'erreur
      onLogout();
      navigate('/login');
    }
  };

  // Vérifier si un lien est actif
  const isActiveLink = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-agri-green" />
            <span className="text-xl font-bold text-gray-900">GreenMetric</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveLink(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    nav-link group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${active
                      ? 'bg-agri-green text-white'
                      : 'text-gray-700 hover:bg-green-50 hover:text-agri-green'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 transition-colors duration-200
                    ${active ? 'text-white' : 'text-gray-400 group-hover:text-agri-green'}
                  `} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Bouton de déconnexion */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="nav-link group flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-600" />
              Déconnexion
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-2 text-2xl font-semibold text-gray-900 lg:ml-0">
                GreenMetric
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Link
                to="/notifications"
                className={`p-2 rounded-md transition-colors duration-200 relative ${isActiveLink('/notifications') ? 'text-agri-green bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User info */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.type_agriculture}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-agri-green flex items-center justify-center overflow-hidden">
                  {user?.photo_profil ? (
                    <img 
                      src={user.photo_profil.startsWith('http') ? user.photo_profil : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${user.photo_profil}`} 
                      alt="Profil" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-white">
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs text-gray-500">
              © 2025 GreenMetric. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>

      {/* Chatbot AI */}
      <Chatbot user={user} />
    </div>
  );
};

export default Layout;
