// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant Register pour l'inscription des nouveaux utilisateurs.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    type_agriculture: 'vivriere',
    zone_geographique: '',
    telephone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Options pour le type d'agriculture
  const typeAgricultureOptions = [
    { value: 'vivriere', label: 'Agriculture vivrière' },
    { value: 'commerciale', label: 'Agriculture commerciale' },
    { value: 'mixte', label: 'Agriculture mixte' },
  ];

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est requis';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est requis';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.zone_geographique.trim()) {
      newErrors.zone_geographique = 'La zone géographique est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await authService.register(formData);
      setSuccess(true);
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({
          general: 'Erreur lors de l\'inscription. Veuillez réessayer.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Affichage du message de succès
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Inscription réussie !
            </h2>
            <p className="text-gray-600 mb-4">
              Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            <div className="animate-pulse">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-agri-green" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Créer un compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Rejoignez la communauté des agriculteurs connectés
          </p>
        </div>

        {/* Formulaire d'inscription */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {/* Erreur générale */}
            {errors.general && (
              <div className="alert alert-error">
                <p className="text-sm">{errors.general}</p>
              </div>
            )}

            {/* Nom d'utilisateur */}
            <div>
              <label htmlFor="username" className="form-label">
                Nom d'utilisateur *
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Choisissez un nom d'utilisateur"
                disabled={loading}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Adresse email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="votre@email.com"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Prénom et Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="form-label">
                  Prénom *
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`form-input ${errors.first_name ? 'border-red-500' : ''}`}
                  placeholder="Prénom"
                  disabled={loading}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="form-label">
                  Nom *
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`form-input ${errors.last_name ? 'border-red-500' : ''}`}
                  placeholder="Nom"
                  disabled={loading}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Type d'agriculture */}
            <div>
              <label htmlFor="type_agriculture" className="form-label">
                Type d'agriculture
              </label>
              <select
                id="type_agriculture"
                name="type_agriculture"
                value={formData.type_agriculture}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                {typeAgricultureOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Zone géographique */}
            <div>
              <label htmlFor="zone_geographique" className="form-label">
                Zone géographique *
              </label>
              <Input
                id="zone_geographique"
                name="zone_geographique"
                type="text"
                required
                value={formData.zone_geographique}
                onChange={handleChange}
                className={`form-input ${errors.zone_geographique ? 'border-red-500' : ''}`}
                placeholder="Ex: Cotonou, Bénin"
                disabled={loading}
              />
              {errors.zone_geographique && (
                <p className="text-red-500 text-xs mt-1">{errors.zone_geographique}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="telephone" className="form-label">
                Numéro de téléphone
              </label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleChange}
                className="form-input"
                placeholder="+229 XX XX XX XX"
                disabled={loading}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="form-label">
                Mot de passe *
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Minimum 8 caractères"
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirmation du mot de passe */}
            <div>
              <label htmlFor="password_confirm" className="form-label">
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <Input
                  id="password_confirm"
                  name="password_confirm"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  required
                  value={formData.password_confirm}
                  onChange={handleChange}
                  className={`form-input pr-10 ${errors.password_confirm ? 'border-red-500' : ''}`}
                  placeholder="Confirmez votre mot de passe"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  disabled={loading}
                >
                  {showPasswordConfirm ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password_confirm && (
                <p className="text-red-500 text-xs mt-1">{errors.password_confirm}</p>
              )}
            </div>

            {/* Bouton d'inscription */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </Button>
            </div>
          </div>

          {/* Lien vers la connexion */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login"
                className="font-medium text-agri-green hover:text-green-700 transition-colors duration-200"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
