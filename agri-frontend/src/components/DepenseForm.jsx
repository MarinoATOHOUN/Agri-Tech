// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant DepenseForm pour ajouter ou modifier une dépense.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { depenseService, cultureService, utils } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const DepenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    description: '',
    montant: '',
    date_depense: '',
    categorie: 'autre',
    culture: '',
    notes: ''
  });

  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const categorieOptions = [
    { value: 'semences', label: 'Semences' },
    { value: 'engrais', label: 'Engrais' },
    { value: 'pesticides', label: 'Pesticides' },
    { value: 'main_oeuvre', label: 'Main d\'œuvre' },
    { value: 'equipement', label: 'Équipement' },
    { value: 'transport', label: 'Transport' },
    { value: 'autre', label: 'Autre' }
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
        const depense = await depenseService.getById(id);
        setFormData({
          description: depense.description || '',
          montant: depense.montant || '',
          date_depense: depense.date_depense || '',
          categorie: depense.categorie || 'autre',
          culture: depense.culture || '',
          notes: depense.notes || ''
        });
      } else {
        // Définir la date d'aujourd'hui par défaut
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({
          ...prev,
          date_depense: today
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      alert('Erreur lors du chargement des données');
      navigate('/depenses');
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

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.montant || parseFloat(formData.montant) <= 0) {
      newErrors.montant = 'Le montant doit être supérieur à 0';
    }

    if (!formData.date_depense) {
      newErrors.date_depense = 'La date de dépense est requise';
    }

    if (!formData.categorie) {
      newErrors.categorie = 'La catégorie est requise';
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
      const depenseData = {
        ...formData,
        montant: parseFloat(formData.montant),
        culture: formData.culture || null
      };

      if (isEdit) {
        await depenseService.update(id, depenseData);
      } else {
        await depenseService.create(depenseData);
      }

      navigate('/depenses');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({
          general: 'Erreur lors de la sauvegarde de la dépense'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getConseil = () => {
    switch (formData.categorie) {
      case 'semences':
        return "Assurez-vous de conserver les factures et de noter la variété des semences pour le suivi.";
      case 'engrais':
        return "Notez le type d'engrais et la quantité pour optimiser les futures applications.";
      case 'pesticides':
        return "Respectez les doses recommandées et les délais avant récolte.";
      case 'main_oeuvre':
        return "Précisez le type de travail effectué et le nombre de personnes.";
      case 'equipement':
        return "Conservez les garanties et planifiez la maintenance.";
      case 'transport':
        return "Notez la destination et le type de transport utilisé.";
      case 'autre':
        return "Soyez précis dans la description pour faciliter le suivi.";
      default:
        return null;
    }
  };

  if (initialLoading) {
    return <LoadingSpinner text="Chargement..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/depenses')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Modifier la dépense' : 'Nouvelle dépense'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Modifiez les informations de votre dépense' : 'Enregistrez une nouvelle dépense'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="form-container">
          <CardHeader>
            <CardTitle>Informations de la dépense</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.general && (
              <div className="alert alert-error">
                <p className="text-sm">{errors.general}</p>
              </div>
            )}

            {/* Description et montant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description de la dépense *
                </label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className={`form-input ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Ex: Achat de semences de maïs"
                  disabled={loading}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="montant" className="form-label">
                  Montant (FCFA) *
                </label>
                <Input
                  id="montant"
                  name="montant"
                  type="number"
                  step="0.01"
                  required
                  value={formData.montant}
                  onChange={handleChange}
                  className={`form-input ${errors.montant ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  disabled={loading}
                />
                {errors.montant && (
                  <p className="text-red-500 text-xs mt-1">{errors.montant}</p>
                )}
              </div>
            </div>

            {/* Date et catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="date_depense" className="form-label">
                  Date de la dépense *
                </label>
                <Input
                  id="date_depense"
                  name="date_depense"
                  type="date"
                  required
                  value={formData.date_depense}
                  onChange={handleChange}
                  className={`form-input ${errors.date_depense ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
                {errors.date_depense && (
                  <p className="text-red-500 text-xs mt-1">{errors.date_depense}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="categorie" className="form-label">
                  Catégorie *
                </label>
                <select
                  id="categorie"
                  name="categorie"
                  required
                  value={formData.categorie}
                  onChange={handleChange}
                  className={`form-select ${errors.categorie ? 'border-red-500' : ''}`}
                  disabled={loading}
                >
                  {categorieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.categorie && (
                  <p className="text-red-500 text-xs mt-1">{errors.categorie}</p>
                )}
              </div>
            </div>

            {/* Culture liée */}
            <div className="form-group">
              <label htmlFor="culture" className="form-label">
                Culture liée (optionnel)
              </label>
              <select
                id="culture"
                name="culture"
                value={formData.culture}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="">Aucune culture spécifique</option>
                {cultures.map(culture => (
                  <option key={culture.id} value={culture.id}>
                    {culture.nom} - {new Date(culture.date_culture).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Associez cette dépense à une culture spécifique pour un meilleur suivi
              </p>
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
                placeholder="Détails supplémentaires, fournisseur, conditions d'achat..."
                rows={4}
                disabled={loading}
              />
            </div>

            {/* Aperçu du montant */}
            {formData.montant && (
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-red-800">
                      Montant de la dépense
                    </h3>
                    <p className="text-2xl font-bold text-red-600">
                      {utils.formatCurrency(formData.montant)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Conseils selon la catégorie */}
            {formData.categorie && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">
                  Conseil pour la catégorie "{categorieOptions.find(c => c.value === formData.categorie)?.label}"
                </h3>
                <p className="text-sm text-blue-700">
                  {getConseil()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/depenses')}
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

export default DepenseForm;
