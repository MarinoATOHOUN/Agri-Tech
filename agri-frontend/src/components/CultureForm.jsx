// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant CultureForm pour ajouter ou modifier une culture.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cultureService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const CultureForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nom: '',
    date_culture: '',
    quantite_semee: '',
    unite_semence: 'kg',
    cout_achat_semences: '',
    cout_main_oeuvre: '',
    zone_geographique: '',
    superficie: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});

  // Unités de mesure communes
  const uniteOptions = [
    { value: 'kg', label: 'Kilogrammes (kg)' },
    { value: 'sacs', label: 'Sacs' },
    { value: 'litres', label: 'Litres' },
    { value: 'tonnes', label: 'Tonnes' },
    { value: 'unites', label: 'Unités' }
  ];

  useEffect(() => {
    if (isEdit) {
      loadCulture();
    }
  }, [id, isEdit]);

  const loadCulture = async () => {
    try {
      setInitialLoading(true);
      const culture = await cultureService.getById(id);
      setFormData({
        nom: culture.nom || '',
        date_culture: culture.date_culture || '',
        quantite_semee: culture.quantite_semee || '',
        unite_semence: culture.unite_semence || 'kg',
        cout_achat_semences: culture.cout_achat_semences || '',
        cout_main_oeuvre: culture.cout_main_oeuvre || '',
        zone_geographique: culture.zone_geographique || '',
        superficie: culture.superficie || '',
        notes: culture.notes || ''
      });
    } catch (error) {
      console.error('Erreur lors du chargement de la culture:', error);
      alert('Erreur lors du chargement de la culture');
      navigate('/cultures');
    } finally {
      setInitialLoading(false);
    }
  };

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom de la culture est requis';
    }

    if (!formData.date_culture) {
      newErrors.date_culture = 'La date de culture est requise';
    }

    if (!formData.quantite_semee || parseFloat(formData.quantite_semee) <= 0) {
      newErrors.quantite_semee = 'La quantité semée doit être supérieure à 0';
    }

    if (!formData.cout_achat_semences || parseFloat(formData.cout_achat_semences) < 0) {
      newErrors.cout_achat_semences = 'Le coût d\'achat des semences est requis';
    }

    if (!formData.cout_main_oeuvre || parseFloat(formData.cout_main_oeuvre) < 0) {
      newErrors.cout_main_oeuvre = 'Le coût de la main d\'œuvre est requis';
    }

    if (!formData.zone_geographique.trim()) {
      newErrors.zone_geographique = 'La zone géographique est requise';
    }

    if (!formData.superficie || parseFloat(formData.superficie) <= 0) {
      newErrors.superficie = 'La superficie doit être supérieure à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const cultureData = {
        ...formData,
        quantite_semee: parseFloat(formData.quantite_semee),
        cout_achat_semences: parseFloat(formData.cout_achat_semences),
        cout_main_oeuvre: parseFloat(formData.cout_main_oeuvre),
        superficie: parseFloat(formData.superficie)
      };

      if (isEdit) {
        await cultureService.update(id, cultureData);
      } else {
        await cultureService.create(cultureData);
      }

      navigate('/cultures');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({
          general: 'Erreur lors de la sauvegarde de la culture'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner text="Chargement de la culture..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/cultures')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Modifier la culture' : 'Nouvelle culture'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Modifiez les informations de votre culture' : 'Ajoutez une nouvelle culture à votre exploitation'}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit}>
        <Card className="form-container">
          <CardHeader>
            <CardTitle>Informations de la culture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Erreur générale */}
            {errors.general && (
              <div className="alert alert-error">
                <p className="text-sm">{errors.general}</p>
              </div>
            )}

            {/* Nom et date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="nom" className="form-label">
                  Nom de la culture *
                </label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  className={`form-input ${errors.nom ? 'border-red-500' : ''}`}
                  placeholder="Ex: Maïs, Riz, Tomate..."
                  disabled={loading}
                />
                {errors.nom && (
                  <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="date_culture" className="form-label">
                  Date de plantation/semis *
                </label>
                <Input
                  id="date_culture"
                  name="date_culture"
                  type="date"
                  required
                  value={formData.date_culture}
                  onChange={handleChange}
                  className={`form-input ${errors.date_culture ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
                {errors.date_culture && (
                  <p className="text-red-500 text-xs mt-1">{errors.date_culture}</p>
                )}
              </div>
            </div>

            {/* Quantité et unité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="quantite_semee" className="form-label">
                  Quantité semée *
                </label>
                <Input
                  id="quantite_semee"
                  name="quantite_semee"
                  type="number"
                  step="0.01"
                  required
                  value={formData.quantite_semee}
                  onChange={handleChange}
                  className={`form-input ${errors.quantite_semee ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.quantite_semee && (
                  <p className="text-red-500 text-xs mt-1">{errors.quantite_semee}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="unite_semence" className="form-label">
                  Unité de mesure
                </label>
                <select
                  id="unite_semence"
                  name="unite_semence"
                  value={formData.unite_semence}
                  onChange={handleChange}
                  className="form-select"
                  disabled={loading}
                >
                  {uniteOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Coûts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="cout_achat_semences" className="form-label">
                  Coût d'achat des semences (FCFA) *
                </label>
                <Input
                  id="cout_achat_semences"
                  name="cout_achat_semences"
                  type="number"
                  step="0.01"
                  required
                  value={formData.cout_achat_semences}
                  onChange={handleChange}
                  className={`form-input ${errors.cout_achat_semences ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.cout_achat_semences && (
                  <p className="text-red-500 text-xs mt-1">{errors.cout_achat_semences}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cout_main_oeuvre" className="form-label">
                  Coût de la main d'œuvre (FCFA) *
                </label>
                <Input
                  id="cout_main_oeuvre"
                  name="cout_main_oeuvre"
                  type="number"
                  step="0.01"
                  required
                  value={formData.cout_main_oeuvre}
                  onChange={handleChange}
                  className={`form-input ${errors.cout_main_oeuvre ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.cout_main_oeuvre && (
                  <p className="text-red-500 text-xs mt-1">{errors.cout_main_oeuvre}</p>
                )}
              </div>
            </div>

            {/* Zone géographique et superficie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="form-group">
                <label htmlFor="superficie" className="form-label">
                  Superficie cultivée (hectares) *
                </label>
                <Input
                  id="superficie"
                  name="superficie"
                  type="number"
                  step="0.01"
                  required
                  value={formData.superficie}
                  onChange={handleChange}
                  className={`form-input ${errors.superficie ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.superficie && (
                  <p className="text-red-500 text-xs mt-1">{errors.superficie}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notes additionnelles
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Observations, conseils, ou informations supplémentaires..."
                rows={4}
                disabled={loading}
              />
            </div>

            {/* Résumé des coûts */}
            {(formData.cout_achat_semences || formData.cout_main_oeuvre) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Résumé des coûts</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Coût des semences:</span>
                    <span>{parseFloat(formData.cout_achat_semences || 0).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coût main d'œuvre:</span>
                    <span>{parseFloat(formData.cout_main_oeuvre || 0).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Total:</span>
                    <span className="text-red-600">
                      {(parseFloat(formData.cout_achat_semences || 0) + parseFloat(formData.cout_main_oeuvre || 0)).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/cultures')}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? 'Modification...' : 'Création...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? 'Modifier' : 'Créer'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CultureForm;
