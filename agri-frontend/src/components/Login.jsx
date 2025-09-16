// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant Login pour l'authentification des utilisateurs.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  // Gérer la soumission du formulaire
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
        // Erreur du serveur
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors[0]);
        } else if (errorData.username) {
          setError(`Nom d'utilisateur: ${errorData.username[0]}`);
        } else if (errorData.password) {
          setError(`Mot de passe: ${errorData.password[0]}`);
        } else {
          setError('Nom d\'utilisateur ou mot de passe incorrect.');
        }
      } else {
        setError('Erreur de connexion. Vérifiez votre connexion internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 p-3 bg-agri-green rounded-full">
              <Sprout className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accédez à votre tableau de bord agricole
          </p>
        </div>

        {/* Formulaire de connexion */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {/* Affichage des erreurs */}
            {error && (
              <div className="alert alert-error">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Nom d'utilisateur */}
            <div>
              <label htmlFor="username" className="form-label">
                Nom d'utilisateur
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Entrez votre nom d'utilisateur"
                disabled={loading}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pr-10"
                  placeholder="Entrez votre mot de passe"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
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

            {/* Bouton de connexion */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </div>
          </div>

          {/* Lien vers l'inscription */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte ?{' '}
              <Link
                to="/register"
                className="font-medium text-agri-green hover:text-green-700 transition-colors duration-200"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </form>

        {/* Informations supplémentaires */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Gestion Agricole
            </h3>
            <p className="text-sm text-gray-600">
              Suivez vos cultures, récoltes et dépenses pour optimiser 
              votre rendement agricole.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
