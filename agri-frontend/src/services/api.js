// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Service API pour les requêtes HTTP vers le backend Django.
 * 
 * Ce fichier centralise toutes les requêtes API et gère l'authentification
 * avec les tokens JWT.
 */

import axios from 'axios';

// Configuration de base d'Axios
const API_BASE_URL = 'http://localhost:8000/api';

// Instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  // Connexion utilisateur
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Déconnexion utilisateur
  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Récupérer le profil utilisateur
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  // Mettre à jour le profil utilisateur
  updateProfile: async (profileData) => {
    const response = await api.patch('/auth/profile/', profileData);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },
};

// Services pour les cultures
export const cultureService = {
  // Récupérer toutes les cultures
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/cultures/?${params}`);
    return response.data;
  },

  // Récupérer une culture par ID
  getById: async (id) => {
    const response = await api.get(`/cultures/${id}/`);
    return response.data;
  },

  // Créer une nouvelle culture
  create: async (cultureData) => {
    const response = await api.post('/cultures/', cultureData);
    return response.data;
  },

  // Mettre à jour une culture
  update: async (id, cultureData) => {
    const response = await api.patch(`/cultures/${id}/`, cultureData);
    return response.data;
  },

  // Supprimer une culture
  delete: async (id) => {
    await api.delete(`/cultures/${id}/`);
  },

  // Récupérer les options de cultures pour les selects
  getOptions: async () => {
    const response = await api.get('/cultures/options/');
    return response.data;
  },
};

// Services pour les récoltes
export const recolteService = {
  // Récupérer toutes les récoltes
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/recoltes/?${params}`);
    return response.data;
  },

  // Récupérer une récolte par ID
  getById: async (id) => {
    const response = await api.get(`/recoltes/${id}/`);
    return response.data;
  },

  // Créer une nouvelle récolte
  create: async (recolteData) => {
    const response = await api.post('/recoltes/', recolteData);
    return response.data;
  },

  // Mettre à jour une récolte
  update: async (id, recolteData) => {
    const response = await api.patch(`/recoltes/${id}/`, recolteData);
    return response.data;
  },

  // Supprimer une récolte
  delete: async (id) => {
    await api.delete(`/recoltes/${id}/`);
  },
};

// Services pour les dépenses
export const depenseService = {
  // Récupérer toutes les dépenses
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/depenses/?${params}`);
    return response.data;
  },

  // Récupérer une dépense par ID
  getById: async (id) => {
    const response = await api.get(`/depenses/${id}/`);
    return response.data;
  },

  // Créer une nouvelle dépense
  create: async (depenseData) => {
    const response = await api.post('/depenses/', depenseData);
    return response.data;
  },

  // Mettre à jour une dépense
  update: async (id, depenseData) => {
    const response = await api.patch(`/depenses/${id}/`, depenseData);
    return response.data;
  },

  // Supprimer une dépense
  delete: async (id) => {
    await api.delete(`/depenses/${id}/`);
  },
};

// Services pour les conseils agricoles
export const conseilService = {
  // Récupérer tous les conseils
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/conseils/?${params}`);
    return response.data;
  },

  // Marquer un conseil comme lu
  markAsRead: async (id) => {
    const response = await api.patch(`/conseils/${id}/marquer-lu/`);
    return response.data;
  },
};

// Services pour le tableau de bord
export const dashboardService = {
  // Récupérer les statistiques du tableau de bord
  getStats: async () => {
    const response = await api.get('/dashboard/stats/');
    return response.data;
  },

  // Récupérer les données des graphiques
  getChartData: async () => {
    const response = await api.get('/dashboard/graphiques/');
    return response.data;
  },
};

// Utilitaires
export const utils = {
  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Récupérer l'utilisateur connecté
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Formater les montants en FCFA
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Formater les dates
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Formater les dates courtes
  formatShortDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  },
};

export default api;
