// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant Cultures pour la gestion des cultures.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cultureService, utils } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const Cultures = () => {
  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    nom: '',
    date_debut: '',
    date_fin: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCultures();
  }, [filters]);

  const loadCultures = async () => {
    try {
      setLoading(true);
      const data = await cultureService.getAll(filters);
      setCultures(data.results || data);
    } catch (error) {
      console.error('Erreur lors du chargement des cultures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette culture ?')) {
      try {
        await cultureService.delete(id);
        setCultures(cultures.filter(culture => culture.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la culture');
      }
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
      nom: '',
      date_debut: '',
      date_fin: ''
    });
  };

  const filteredCultures = cultures.filter(culture =>
    culture.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    culture.zone_geographique.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Chargement des cultures..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Cultures</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos cultures et suivez leur évolution
          </p>
        </div>
        <Link to="/cultures/nouveau">
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle culture
          </Button>
        </Link>
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou zone..."
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

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Nom de la culture</label>
                  <Input
                    name="nom"
                    value={filters.nom}
                    onChange={handleFilterChange}
                    placeholder="Ex: Maïs"
                  />
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

      {/* Liste des cultures */}
      {filteredCultures.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              {cultures.length === 0 ? (
                <>
                  <p className="text-lg mb-4">Aucune culture enregistrée</p>
                  <p className="mb-6">Commencez par ajouter votre première culture</p>
                  <Link to="/cultures/nouveau">
                    <Button className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une culture
                    </Button>
                  </Link>
                </>
              ) : (
                <p>Aucune culture ne correspond à votre recherche</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCultures.map((culture) => (
            <Card key={culture.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-agri-green">
                    {culture.nom}
                  </span>
                  <div className="flex space-x-2">
                    <Link to={`/cultures/${culture.id}/modifier`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(culture.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date de culture</p>
                    <p className="font-medium">{utils.formatShortDate(culture.date_culture)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Superficie</p>
                    <p className="font-medium">{culture.superficie} ha</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Quantité semée</p>
                    <p className="font-medium">{culture.quantite_semee} {culture.unite_semence}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Coût initial</p>
                    <p className="font-medium text-red-600">
                      {utils.formatCurrency(culture.cout_total_initial)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Zone géographique</p>
                  <p className="font-medium">{culture.zone_geographique}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-gray-600 text-sm">Récoltes</p>
                    <p className="font-medium text-agri-green">{culture.nombre_recoltes}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Revenus</p>
                    <p className="font-medium text-green-600">
                      {utils.formatCurrency(culture.revenus_totaux)}
                    </p>
                  </div>
                </div>

                {culture.rendement_par_hectare > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Rendement</p>
                    <p className="font-semibold text-green-700">
                      {culture.rendement_par_hectare.toFixed(2)} kg/ha
                    </p>
                  </div>
                )}

                {culture.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-sm">{culture.notes.substring(0, 100)}...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistiques rapides */}
      {cultures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-agri-green">{cultures.length}</p>
                <p className="text-sm text-gray-600">Total cultures</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-agri-brown">
                  {cultures.reduce((sum, c) => sum + parseFloat(c.superficie), 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Hectares cultivés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {utils.formatCurrency(cultures.reduce((sum, c) => sum + parseFloat(c.revenus_totaux), 0))}
                </p>
                <p className="text-sm text-gray-600">Revenus totaux</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {utils.formatCurrency(cultures.reduce((sum, c) => sum + parseFloat(c.cout_total_initial), 0))}
                </p>
                <p className="text-sm text-gray-600">Coûts initiaux</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cultures;
