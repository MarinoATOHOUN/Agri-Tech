// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant Depenses pour la gestion des dépenses.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Filter, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { depenseService, utils } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const Depenses = () => {
  const [depenses, setDepenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categorie: '',
    date_debut: '',
    date_fin: ''
  });
  const [showFilters, setShowFilters] = useState(false);

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
    loadDepenses();
  }, [filters]);

  const loadDepenses = async () => {
    try {
      setLoading(true);
      const data = await depenseService.getAll(filters);
      setDepenses(data.results || data);
    } catch (error) {
      console.error('Erreur lors du chargement des dépenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      try {
        await depenseService.delete(id);
        setDepenses(depenses.filter(depense => depense.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la dépense');
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
      categorie: '',
      date_debut: '',
      date_fin: ''
    });
  };

  const filteredDepenses = depenses.filter(depense =>
    depense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    depense.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (categorie) => {
    return <DollarSign className="h-4 w-4" />;
  };

  const getCategoryColor = (categorie) => {
    const colors = {
      semences: 'text-green-600',
      engrais: 'text-yellow-600',
      pesticides: 'text-red-600',
      main_oeuvre: 'text-blue-600',
      equipement: 'text-purple-600',
      transport: 'text-orange-600',
      autre: 'text-gray-600'
    };
    return colors[categorie] || 'text-gray-600';
  };

  if (loading) {
    return <LoadingSpinner text="Chargement des dépenses..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Dépenses</h1>
          <p className="text-gray-600 mt-1">
            Suivez et gérez toutes vos dépenses agricoles
          </p>
        </div>
        <Link to="/depenses/nouveau">
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle dépense
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
                placeholder="Rechercher par description ou catégorie..."
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
                  <label className="form-label">Catégorie</label>
                  <select
                    name="categorie"
                    value={filters.categorie}
                    onChange={handleFilterChange}
                    className="form-select"
                  >
                    <option value="">Toutes les catégories</option>
                    {categorieOptions.map(option => (
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

      {/* Liste des dépenses */}
      {filteredDepenses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              {depenses.length === 0 ? (
                <>
                  <p className="text-lg mb-4">Aucune dépense enregistrée</p>
                  <p className="mb-6">Commencez par ajouter votre première dépense</p>
                  <Link to="/depenses/nouveau">
                    <Button className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une dépense
                    </Button>
                  </Link>
                </>
              ) : (
                <p>Aucune dépense ne correspond à votre recherche</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDepenses.map((depense) => (
            <Card key={depense.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`p-2 rounded-full bg-gray-100 ${getCategoryColor(depense.categorie)}`}>
                      {getCategoryIcon(depense.categorie)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {depense.description}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Link to={`/depenses/${depense.id}/modifier`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(depense.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Catégorie</p>
                          <p className="font-medium capitalize">
                            {categorieOptions.find(c => c.value === depense.categorie)?.label || depense.categorie}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-medium">{utils.formatShortDate(depense.date_depense)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Montant</p>
                          <p className="font-medium text-red-600 text-lg">
                            {utils.formatCurrency(depense.montant)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Culture liée</p>
                          <p className="font-medium">
                            {depense.culture_nom || 'Non spécifiée'}
                          </p>
                        </div>
                      </div>

                      {depense.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Notes:</p>
                          <p className="text-sm">{depense.notes}</p>
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

      {/* Statistiques rapides */}
      {depenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Résumé des dépenses */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé des dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total des dépenses</span>
                  <span className="text-2xl font-bold text-red-600">
                    {utils.formatCurrency(depenses.reduce((sum, d) => sum + parseFloat(d.montant), 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nombre de dépenses</span>
                  <span className="text-xl font-semibold">{depenses.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dépense moyenne</span>
                  <span className="text-lg font-medium">
                    {utils.formatCurrency(depenses.reduce((sum, d) => sum + parseFloat(d.montant), 0) / depenses.length)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dépenses par catégorie */}
          <Card>
            <CardHeader>
              <CardTitle>Dépenses par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categorieOptions.map(categorie => {
                  const depensesCategorie = depenses.filter(d => d.categorie === categorie.value);
                  const total = depensesCategorie.reduce((sum, d) => sum + parseFloat(d.montant), 0);
                  
                  if (total === 0) return null;
                  
                  return (
                    <div key={categorie.value} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{categorie.label}</span>
                      <div className="text-right">
                        <span className="font-medium">{utils.formatCurrency(total)}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({depensesCategorie.length})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Depenses;
