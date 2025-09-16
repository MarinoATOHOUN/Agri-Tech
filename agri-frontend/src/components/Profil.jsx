// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant Profil pour la gestion du profil utilisateur.
 */

import { useState } from 'react';
import { User, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '../services/api';

const Profil = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    type_agriculture: user?.type_agriculture || 'vivriere',
    zone_geographique: user?.zone_geographique || '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const typeAgricultureOptions = [
    { value: 'vivriere', label: 'Agriculture vivrière' },
    { value: 'commerciale', label: 'Agriculture commerciale' },
    { value: 'mixte', label: 'Agriculture mixte' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est requis';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.zone_geographique.trim()) {
      newErrors.zone_geographique = 'La zone géographique est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.current_password) {
      newErrors.current_password = 'Le mot de passe actuel est requis';
    }

    if (!passwordData.new_password) {
      newErrors.new_password = 'Le nouveau mot de passe est requis';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Les mots de passe ne correspondent pas';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      setSuccess('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({
          general: 'Erreur lors de la mise à jour du profil'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setPasswordLoading(true);
    setPasswordErrors({});
    setPasswordSuccess('');

    try {
      await authService.changePassword(passwordData);
      setPasswordSuccess('Mot de passe modifié avec succès !');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      if (error.response?.data) {
        setPasswordErrors(error.response.data);
      } else {
        setPasswordErrors({
          general: 'Erreur lors du changement de mot de passe'
        });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-agri-green rounded-full">
          <User className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos informations personnelles et paramètres de compte
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {errors.general && (
                <div className="alert alert-error">
                  <p className="text-sm">{errors.general}</p>
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  <p className="text-sm">{success}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
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
                    disabled={loading}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div className="form-group">
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
                    disabled={loading}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
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
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="form-group">
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

              <div className="form-group">
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

              <div className="form-group">
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Mettre à jour le profil
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle>Changer le mot de passe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordErrors.general && (
                <div className="alert alert-error">
                  <p className="text-sm">{passwordErrors.general}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="alert alert-success">
                  <p className="text-sm">{passwordSuccess}</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="current_password" className="form-label">
                  Mot de passe actuel *
                </label>
                <div className="relative">
                  <Input
                    id="current_password"
                    name="current_password"
                    type={showPasswords.current ? 'text' : 'password'}
                    required
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className={`form-input pr-10 ${passwordErrors.current_password ? 'border-red-500' : ''}`}
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('current')}
                    disabled={passwordLoading}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.current_password && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="new_password" className="form-label">
                  Nouveau mot de passe *
                </label>
                <div className="relative">
                  <Input
                    id="new_password"
                    name="new_password"
                    type={showPasswords.new ? 'text' : 'password'}
                    required
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className={`form-input pr-10 ${passwordErrors.new_password ? 'border-red-500' : ''}`}
                    placeholder="Minimum 8 caractères"
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('new')}
                    disabled={passwordLoading}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.new_password && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.new_password}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password" className="form-label">
                  Confirmer le nouveau mot de passe *
                </label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    required
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className={`form-input pr-10 ${passwordErrors.confirm_password ? 'border-red-500' : ''}`}
                    placeholder="Confirmez votre nouveau mot de passe"
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('confirm')}
                    disabled={passwordLoading}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.confirm_password && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.confirm_password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={passwordLoading}
                className="w-full btn-secondary flex items-center justify-center"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Changer le mot de passe
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Informations du compte */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Nom d'utilisateur</p>
              <p className="font-medium">{user?.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date d'inscription</p>
              <p className="font-medium">
                {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('fr-FR') : 'Non disponible'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dernière connexion</p>
              <p className="font-medium">
                {user?.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Non disponible'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profil;
