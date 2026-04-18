// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
/**
 * Composant Register pour l'inscription des nouveaux utilisateurs.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'L\'email n\'est pas valide';
    if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis';
    if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    else if (formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';
    if (formData.password !== formData.password_confirm) newErrors.password_confirm = 'Mots de passe différents';
    if (!formData.zone_geographique.trim()) newErrors.zone_geographique = 'Zone requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      await authService.register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      if (error.response?.data) setErrors(error.response.data);
      else setErrors({ general: 'Erreur lors de l\'inscription.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center h-24 w-24 bg-green-50 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-agri-green animate-bounce" />
          </div>
          <h2 className="text-3xl font-black text-gray-900">Bienvenue à bord !</h2>
          <p className="text-gray-500 text-lg">
            Votre compte a été créé. Redirection vers la page de connexion...
          </p>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-agri-green" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Sidebar - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-agri-green relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <Sprout className="w-full h-full scale-150 rotate-12" />
        </div>
        
        <Link to="/" className="relative z-10 flex items-center text-white font-bold text-2xl group">
          <ArrowLeft className="h-6 w-6 mr-3 group-hover:-translate-x-2 transition-transform" />
          GreenMetric
        </Link>

        <div className="relative z-10 space-y-6">
          <h1 className="text-6xl font-black text-white leading-tight">
            Cultivez votre <br /> <span className="text-green-200">Succès Agricole</span>
          </h1>
          <p className="text-green-50 text-xl max-w-lg leading-relaxed opacity-80">
            Rejoignez des milliers d'agriculteurs qui utilisent l'IA pour optimiser leurs récoltes et leurs revenus.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-10">
            <div>
              <p className="text-4xl font-bold text-white">500+</p>
              <p className="text-green-100 text-sm">Agriculteurs actifs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">+35%</p>
              <p className="text-green-100 text-sm">Augmentation du rendement</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-green-100 text-sm italic">
          Propulsé par BlackBenAI - L'IA au service de l'Afrique.
        </div>
      </div>

      {/* Main Content - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-12 lg:p-12 overflow-y-auto bg-gray-50/50">
        <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-12 relative my-12">
          {/* Mobile Header (Inside Card) */}
          <div className="lg:hidden flex justify-between items-center mb-8">
             <Link to="/" className="flex items-center text-agri-green font-bold text-xl">
               <Sprout className="h-8 w-8 mr-2" />
               GreenMetric
             </Link>
             <Link to="/" className="p-2 bg-gray-50 rounded-full">
               <ArrowLeft className="h-5 w-5 text-gray-400" />
             </Link>
          </div>

          <div className="space-y-2 mb-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Rejoignez-nous</h2>
            <p className="text-gray-500">Créez votre compte gratuit en 2 minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Prénom</label>
                <Input
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Prénom"
                  className={`h-12 rounded-xl ${errors.first_name ? 'border-red-500' : 'border-gray-100 bg-gray-50/50'}`}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Nom</label>
                <Input
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Nom"
                  className={`h-12 rounded-xl ${errors.last_name ? 'border-red-500' : 'border-gray-100 bg-gray-50/50'}`}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Adresse Email</label>
              <Input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className={`h-12 rounded-xl ${errors.email ? 'border-red-500' : 'border-gray-100 bg-gray-50/50'}`}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Localisation</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    name="zone_geographique"
                    required
                    value={formData.zone_geographique}
                    onChange={handleChange}
                    placeholder="Ville, Pays"
                    className="h-12 rounded-xl pl-10 border-gray-100 bg-gray-50/50"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+229..."
                    className="h-12 rounded-xl pl-10 border-gray-100 bg-gray-50/50"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Type d'Exploitation</label>
              <select
                name="type_agriculture"
                value={formData.type_agriculture}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border-gray-100 bg-gray-50/50 px-4 text-sm focus:ring-2 focus:ring-agri-green outline-none"
                disabled={loading}
              >
                {typeAgricultureOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Mot de passe</label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 caractères"
                  className={`h-12 rounded-xl pr-12 ${errors.password ? 'border-red-500' : 'border-gray-100 bg-gray-50/50'}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Confirmer le mot de passe</label>
              <div className="relative">
                <Input
                  name="password_confirm"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  required
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="Confirmez"
                  className={`h-12 rounded-xl pr-12 ${errors.password_confirm ? 'border-red-500' : 'border-gray-100 bg-gray-50/50'}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  {showPasswordConfirm ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-agri-green hover:bg-agri-dark-green text-white text-lg font-bold shadow-lg shadow-green-100 transition-all active:scale-[0.98] mt-4"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Création du compte...</span>
                </div>
              ) : 'Créer mon compte'}
            </Button>
          </form>

          <div className="text-center pt-8">
            <p className="text-gray-500">
              Déjà inscrit ?{' '}
              <Link to="/login" className="font-bold text-agri-green hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
