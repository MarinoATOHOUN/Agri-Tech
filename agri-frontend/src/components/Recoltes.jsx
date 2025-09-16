// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant Recoltes pour la gestion des récoltes.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { recolteService, cultureService, utils } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const Recoltes = () => {
  const [recoltes, setRecoltes] = useState([]);
  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    culture: '',
    date_debut: '',
    date_fin: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recoltesData, culturesData] = await Promise.all([
        recolteService.getAll(filters),
        cultureService.getOptions()
      ]);
      setRecoltes(recoltesData.results || recoltesData);
      setCultures(culturesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette récolte ?')) {
      try {
        await recolteService.delete(id);
        setRecoltes(recoltes.filter(recolte => recolte.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la récolte');
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
      culture: '',
      date_debut: '',
      date_fin: ''
    });
  };

  const filteredRecoltes = recoltes.filter(recolte =>
    recolte.culture_nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQualityBadgeClass = (qualite) => {
    switch (qualite) {
      case 'excellente': return 'badge-success';
      case 'bonne': return 'badge-info';
      case 'moyenne': return 'badge-warning';
      case 'faible': return 'badge-error';
      default: return 'badge-info';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Chargement des récoltes..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Récoltes</h1>
          <p className="text-gray-600 mt-1">
            Suivez vos récoltes et analysez vos rendements
          </p>
        </div>
        <Link to="/recoltes/nouveau">
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle récolte
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
                placeholder="Rechercher par culture..."
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
                  <label className="form-label">Culture</label>
                  <select
                    name="culture"
                    value={filters.culture}
                    onChange={handleFilterChange}
                    className="form-select"
                  >
                    <option value="">Toutes les cultures</option>
                    {cultures.map(culture => (
                      <option key={culture.id} value={culture.id}>
                        {culture.nom}
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

      {/* Liste des récoltes */}
      {filteredRecoltes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              {recoltes.length === 0 ? (
                <>
                  <p className="text-lg mb-4">Aucune récolte enregistrée</p>
                  <p className="mb-6">Commencez par ajouter votre première récolte</p>
                  <Link to="/recoltes/nouveau">
                    <Button className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une récolte
                    </Button>
                  </Link>
                </>
              ) : (
                <p>Aucune récolte ne correspond à votre recherche</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecoltes.map((recolte) => (
            <Card key={recolte.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-agri-brown">
                    {recolte.culture_nom}
                  </span>
                  <div className="flex space-x-2">
                    <Link to={`/recoltes/${recolte.id}/modifier`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(recolte.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Date de récolte</span>
                  <span className="font-medium">{utils.formatShortDate(recolte.date_recolte)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quantité récoltée</span>
                  <span className="font-medium">{recolte.quantite_recoltee} {recolte.unite_recolte}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Prix unitaire</span>
                  <span className="font-medium">{utils.formatCurrency(recolte.prix_vente_unitaire)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenus totaux</span>
                  <span className="font-medium text-green-600">
                    {utils.formatCurrency(recolte.revenus_totaux)}
                  </span>
                </div>

                {recolte.depenses_liees_recolte > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Dépenses liées</span>
                    <span className="font-medium text-red-600">
                      {utils.formatCurrency(recolte.depenses_liees_recolte)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bénéfice net</span>
                  <span className={`font-medium ${
                    recolte.benefice_net >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {utils.formatCurrency(recolte.benefice_net)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-gray-600">Qualité</span>
                  <span className={`badge ${getQualityBadgeClass(recolte.qualite_recolte)}`}>
                    {recolte.qualite_recolte}
                  </span>
                </div>

                {recolte.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-sm">{recolte.notes.substring(0, 100)}...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistiques rapides */}
      {recoltes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques des récoltes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-agri-brown">{recoltes.length}</p>
                <p className="text-sm text-gray-600">Total récoltes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {utils.formatCurrency(recoltes.reduce((sum, r) => sum + parseFloat(r.revenus_totaux), 0))}
                </p>
                <p className="text-sm text-gray-600">Revenus totaux</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {utils.formatCurrency(recoltes.reduce((sum, r) => sum + parseFloat(r.depenses_liees_recolte), 0))}
                </p>
                <p className="text-sm text-gray-600">Dépenses liées</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {utils.formatCurrency(recoltes.reduce((sum, r) => sum + parseFloat(r.benefice_net), 0))}
                </p>
                <p className="text-sm text-gray-600">Bénéfice net total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Recoltes;
