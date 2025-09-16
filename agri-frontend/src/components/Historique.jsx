// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant Historique pour afficher l'historique des activités.
 */

import { useState, useEffect } from 'react';
import { Calendar, Filter, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cultureService, recolteService, depenseService, utils } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const Historique = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    date_debut: '',
    date_fin: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const typeOptions = [
    { value: 'culture', label: 'Cultures' },
    { value: 'recolte', label: 'Récoltes' },
    { value: 'depense', label: 'Dépenses' }
  ];

  useEffect(() => {
    loadHistorique();
  }, [filters]);

  const loadHistorique = async () => {
    try {
      setLoading(true);
      
      // Charger toutes les données en parallèle
      const [cultures, recoltes, depenses] = await Promise.all([
        cultureService.getAll(),
        recolteService.getAll(),
        depenseService.getAll()
      ]);

      // Transformer les données en activités avec un format uniforme
      const activitiesData = [];

      // Ajouter les cultures
      if (!filters.type || filters.type === 'culture') {
        (cultures.results || cultures).forEach(culture => {
          activitiesData.push({
            id: `culture-${culture.id}`,
            type: 'culture',
            title: `Culture: ${culture.nom}`,
            description: `Plantation de ${culture.quantite_semee} ${culture.unite_semence} sur ${culture.superficie} ha`,
            date: culture.date_culture,
            montant: -culture.cout_total_initial,
            zone: culture.zone_geographique,
            details: culture
          });
        });
      }

      // Ajouter les récoltes
      if (!filters.type || filters.type === 'recolte') {
        (recoltes.results || recoltes).forEach(recolte => {
          activitiesData.push({
            id: `recolte-${recolte.id}`,
            type: 'recolte',
            title: `Récolte: ${recolte.culture_nom}`,
            description: `Récolte de ${recolte.quantite_recoltee} ${recolte.unite_recolte}`,
            date: recolte.date_recolte,
            montant: recolte.revenus_totaux,
            zone: recolte.culture_zone || '',
            details: recolte
          });
        });
      }

      // Ajouter les dépenses
      if (!filters.type || filters.type === 'depense') {
        (depenses.results || depenses).forEach(depense => {
          activitiesData.push({
            id: `depense-${depense.id}`,
            type: 'depense',
            title: `Dépense: ${depense.description}`,
            description: `Catégorie: ${depense.categorie}`,
            date: depense.date_depense,
            montant: -depense.montant,
            zone: '',
            details: depense
          });
        });
      }

      // Filtrer par date si spécifié
      let filteredActivities = activitiesData;
      if (filters.date_debut) {
        filteredActivities = filteredActivities.filter(
          activity => new Date(activity.date) >= new Date(filters.date_debut)
        );
      }
      if (filters.date_fin) {
        filteredActivities = filteredActivities.filter(
          activity => new Date(activity.date) <= new Date(filters.date_fin)
        );
      }

      // Trier par date décroissante
      filteredActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

      setActivities(filteredActivities);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      date_debut: '',
      date_fin: ''
    });
  };

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActivityIcon = (type) => {
    switch (type) {
      case 'culture':
        return '🌱';
      case 'recolte':
        return '📦';
      case 'depense':
        return '💰';
      default:
        return '📋';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'culture':
        return 'border-l-green-500 bg-green-50';
      case 'recolte':
        return 'border-l-blue-500 bg-blue-50';
      case 'depense':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Type', 'Titre', 'Description', 'Montant', 'Zone'],
      ...filteredActivities.map(activity => [
        utils.formatShortDate(activity.date),
        activity.type,
        activity.title,
        activity.description,
        activity.montant,
        activity.zone
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historique_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingSpinner text="Chargement de l'historique..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historique</h1>
          <p className="text-gray-600 mt-1">
            Consultez l'historique complet de vos activités agricoles
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher dans l'historique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Type d'activité</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="form-select"
                  >
                    <option value="">Tous les types</option>
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Date de début</label>
                  <Input
                    type="date"
                    name="date_debut"
                    value={filters.date_debut}
                    onChange={handleFilterChange}
                  />
                </div>
                <div>
                  <label className="form-label">Date de fin</label>
                  <Input
                    type="date"
                    name="date_fin"
                    value={filters.date_fin}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      {activities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
                <p className="text-sm text-gray-600">Total activités</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {activities.filter(a => a.type === 'culture').length}
                </p>
                <p className="text-sm text-gray-600">Cultures</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {activities.filter(a => a.type === 'recolte').length}
                </p>
                <p className="text-sm text-gray-600">Récoltes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {activities.filter(a => a.type === 'depense').length}
                </p>
                <p className="text-sm text-gray-600">Dépenses</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des activités */}
      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-500 mb-2">Aucune activité trouvée</p>
            <p className="text-gray-400">
              {activities.length === 0 
                ? "Commencez par ajouter des cultures, récoltes ou dépenses"
                : "Aucune activité ne correspond à votre recherche"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className={`border-l-4 ${getActivityColor(activity.type)}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-2xl">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </h3>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {utils.formatShortDate(activity.date)}
                          </p>
                          <p className={`text-lg font-bold ${
                            activity.montant >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {activity.montant >= 0 ? '+' : ''}{utils.formatCurrency(activity.montant)}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{activity.description}</p>
                      
                      {activity.zone && (
                        <p className="text-sm text-gray-500">
                          📍 {activity.zone}
                        </p>
                      )}

                      {/* Détails spécifiques selon le type */}
                      {activity.type === 'recolte' && activity.details.qualite_recolte && (
                        <div className="mt-2">
                          <span className={`badge ${
                            activity.details.qualite_recolte === 'excellente' ? 'badge-success' :
                            activity.details.qualite_recolte === 'bonne' ? 'badge-info' :
                            activity.details.qualite_recolte === 'moyenne' ? 'badge-warning' : 'badge-error'
                          }`}>
                            Qualité: {activity.details.qualite_recolte}
                          </span>
                        </div>
                      )}

                      {activity.details.notes && (
                        <div className="mt-3 p-2 bg-white rounded border">
                          <p className="text-sm text-gray-600">
                            <strong>Notes:</strong> {activity.details.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Résumé financier */}
      {filteredActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé financier de la période</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total revenus</p>
                <p className="text-2xl font-bold text-green-600">
                  {utils.formatCurrency(
                    filteredActivities
                      .filter(a => a.montant > 0)
                      .reduce((sum, a) => sum + a.montant, 0)
                  )}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total dépenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {utils.formatCurrency(
                    Math.abs(filteredActivities
                      .filter(a => a.montant < 0)
                      .reduce((sum, a) => sum + a.montant, 0))
                  )}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Bilan net</p>
                <p className={`text-2xl font-bold ${
                  filteredActivities.reduce((sum, a) => sum + a.montant, 0) >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {utils.formatCurrency(
                    filteredActivities.reduce((sum, a) => sum + a.montant, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Historique;
