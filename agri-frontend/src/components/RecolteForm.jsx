// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant RecolteForm pour ajouter ou modifier une récolte.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { recolteService, cultureService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const RecolteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    culture: '',
    date_recolte: '',
    quantite_recoltee: '',
    unite_recolte: 'kg',
    prix_vente_unitaire: '',
    depenses_liees_recolte: '0',
    qualite_recolte: 'bonne',
    notes: ''
  });

  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const uniteOptions = [
    { value: 'kg', label: 'Kilogrammes (kg)' },
    { value: 'sacs', label: 'Sacs' },
    { value: 'litres', label: 'Litres' },
    { value: 'tonnes', label: 'Tonnes' },
    { value: 'unites', label: 'Unités' }
  ];

  const qualiteOptions = [
    { value: 'excellente', label: 'Excellente' },
    { value: 'bonne', label: 'Bonne' },
    { value: 'moyenne', label: 'Moyenne' },
    { value: 'faible', label: 'Faible' }
  ];

  useEffect(() => {
    loadInitialData();
  }, [id, isEdit]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      const culturesData = await cultureService.getOptions();
      setCultures(culturesData);

      if (isEdit) {
        const recolte = await recolteService.getById(id);
        setFormData({
          culture: recolte.culture || '',
          date_recolte: recolte.date_recolte || '',
          quantite_recoltee: recolte.quantite_recoltee || '',
          unite_recolte: recolte.unite_recolte || 'kg',
          prix_vente_unitaire: recolte.prix_vente_unitaire || '',
          depenses_liees_recolte: recolte.depenses_liees_recolte || '0',
          qualite_recolte: recolte.qualite_recolte || 'bonne',
          notes: recolte.notes || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      alert('Erreur lors du chargement des données');
      navigate('/recoltes');
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
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.culture) {
      newErrors.culture = 'La culture est requise';
    }

    if (!formData.date_recolte) {
      newErrors.date_recolte = 'La date de récolte est requise';
    }

    if (!formData.quantite_recoltee || parseFloat(formData.quantite_recoltee) <= 0) {
      newErrors.quantite_recoltee = 'La quantité récoltée doit être supérieure à 0';
    }

    if (!formData.prix_vente_unitaire || parseFloat(formData.prix_vente_unitaire) < 0) {
      newErrors.prix_vente_unitaire = 'Le prix de vente unitaire est requis';
    }

    if (parseFloat(formData.depenses_liees_recolte) < 0) {
      newErrors.depenses_liees_recolte = 'Les dépenses ne peuvent pas être négatives';
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
      const recolteData = {
        ...formData,
        culture: parseInt(formData.culture),
        quantite_recoltee: parseFloat(formData.quantite_recoltee),
        prix_vente_unitaire: parseFloat(formData.prix_vente_unitaire),
        depenses_liees_recolte: parseFloat(formData.depenses_liees_recolte)
      };

      if (isEdit) {
        await recolteService.update(id, recolteData);
      } else {
        await recolteService.create(recolteData);
      }

      navigate('/recoltes');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({
          general: 'Erreur lors de la sauvegarde de la récolte'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenues = () => {
    const quantite = parseFloat(formData.quantite_recoltee) || 0;
    const prix = parseFloat(formData.prix_vente_unitaire) || 0;
    return quantite * prix;
  };

  const calculateBenefit = () => {
    const revenus = calculateRevenues();
    const depenses = parseFloat(formData.depenses_liees_recolte) || 0;
    return revenus - depenses;
  };

  if (initialLoading) {
    return <LoadingSpinner text="Chargement..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/recoltes')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Modifier la récolte' : 'Nouvelle récolte'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Modifiez les informations de votre récolte' : 'Enregistrez une nouvelle récolte'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="form-container">
          <CardHeader>
            <CardTitle>Informations de la récolte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.general && (
              <div className="alert alert-error">
                <p className="text-sm">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="culture" className="form-label">
                  Culture *
                </label>
                <select
                  id="culture"
                  name="culture"
                  required
                  value={formData.culture}
                  onChange={handleChange}
                  className={`form-select ${errors.culture ? 'border-red-500' : ''}`}
                  disabled={loading}
                >
                  <option value="">Sélectionnez une culture</option>
                  {cultures.map(culture => (
                    <option key={culture.id} value={culture.id}>
                      {culture.nom} - {new Date(culture.date_culture).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                {errors.culture && (
                  <p className="text-red-500 text-xs mt-1">{errors.culture}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="date_recolte" className="form-label">
                  Date de récolte *
                </label>
                <Input
                  id="date_recolte"
                  name="date_recolte"
                  type="date"
                  required
                  value={formData.date_recolte}
                  onChange={handleChange}
                  className={`form-input ${errors.date_recolte ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
                {errors.date_recolte && (
                  <p className="text-red-500 text-xs mt-1">{errors.date_recolte}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="quantite_recoltee" className="form-label">
                  Quantité récoltée *
                </label>
                <Input
                  id="quantite_recoltee"
                  name="quantite_recoltee"
                  type="number"
                  step="0.01"
                  required
                  value={formData.quantite_recoltee}
                  onChange={handleChange}
                  className={`form-input ${errors.quantite_recoltee ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.quantite_recoltee && (
                  <p className="text-red-500 text-xs mt-1">{errors.quantite_recoltee}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="unite_recolte" className="form-label">
                  Unité de mesure
                </label>
                <select
                  id="unite_recolte"
                  name="unite_recolte"
                  value={formData.unite_recolte}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="prix_vente_unitaire" className="form-label">
                  Prix de vente unitaire (FCFA) *
                </label>
                <Input
                  id="prix_vente_unitaire"
                  name="prix_vente_unitaire"
                  type="number"
                  step="0.01"
                  required
                  value={formData.prix_vente_unitaire}
                  onChange={handleChange}
                  className={`form-input ${errors.prix_vente_unitaire ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.prix_vente_unitaire && (
                  <p className="text-red-500 text-xs mt-1">{errors.prix_vente_unitaire}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="depenses_liees_recolte" className="form-label">
                  Dépenses liées à la récolte (FCFA)
                </label>
                <Input
                  id="depenses_liees_recolte"
                  name="depenses_liees_recolte"
                  type="number"
                  step="0.01"
                  value={formData.depenses_liees_recolte}
                  onChange={handleChange}
                  className={`form-input ${errors.depenses_liees_recolte ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.depenses_liees_recolte && (
                  <p className="text-red-500 text-xs mt-1">{errors.depenses_liees_recolte}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="qualite_recolte" className="form-label">
                Qualité de la récolte
              </label>
              <select
                id="qualite_recolte"
                name="qualite_recolte"
                value={formData.qualite_recolte}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                {qualiteOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notes sur la récolte
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Observations sur la qualité, les conditions, etc."
                rows={4}
                disabled={loading}
              />
            </div>

            {/* Calculs automatiques */}
            {(formData.quantite_recoltee || formData.prix_vente_unitaire || formData.depenses_liees_recolte) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Calculs automatiques</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Revenus totaux:</span>
                    <span className="text-green-600 font-medium">
                      {calculateRevenues().toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dépenses liées:</span>
                    <span className="text-red-600 font-medium">
                      {parseFloat(formData.depenses_liees_recolte || 0).toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Bénéfice net:</span>
                    <span className={calculateBenefit() >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {calculateBenefit().toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/recoltes')}
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

export default RecolteForm;
