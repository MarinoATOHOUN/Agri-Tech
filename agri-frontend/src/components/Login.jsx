// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
/**
 * Composant Login pour l'authentification des utilisateurs.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      onLogin(response.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors[0]);
        } else if (errorData.email) {
          setError(`Email: ${errorData.email[0]}`);
        } else if (errorData.password) {
          setError(`Mot de passe: ${errorData.password[0]}`);
        } else {
          setError('Email ou mot de passe incorrect.');
        }
      } else {
        setError('Erreur de connexion. Vérifiez votre connexion internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-agri-green/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-agri-brown/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-md w-full px-4 relative z-10">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-agri-green mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-2xl mb-6">
                <Sprout className="h-10 w-10 text-agri-green" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Bon retour !
              </h2>
              <p className="mt-2 text-gray-500">
                Connectez-vous pour gérer votre exploitation
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <ShieldCheck className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                <Input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-agri-green transition-all"
                  placeholder="exemple@email.com"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-gray-700">Mot de passe</label>
                  <a href="#" className="text-xs font-semibold text-agri-green hover:underline">Oublié ?</a>
                </div>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-agri-green transition-all pr-12"
                    placeholder="Votre mot de passe"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-agri-green hover:bg-agri-dark-green text-white text-lg font-bold shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Connexion...</span>
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="mt-10 pt-10 border-t border-gray-50 text-center">
              <p className="text-gray-500">
                Pas encore membre ?{' '}
                <Link
                  to="/register"
                  className="font-bold text-agri-green hover:text-agri-dark-green transition-colors"
                >
                  Créer un compte gratuit
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
