// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant Dashboard pour le tableau de bord principal.
 * 
 * Affiche les statistiques générales, graphiques et conseils.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Sprout, 
  Package, 
  DollarSign, 
  AlertCircle,
  Plus,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, conseilService, utils } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [conseils, setConseils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Couleurs pour les graphiques
  const COLORS = ['#4CAF50', '#8D6E63', '#FFEB3B', '#FF9800', '#2196F3'];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, chartDataResponse, conseilsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getChartData(),
        conseilService.getAll({ lu: false })
      ]);

      setStats(statsData);
      setChartData(chartDataResponse);
      setConseils(conseilsData.results || conseilsData);
    } catch (error) {
      console.error('Erreur détaillée lors du chargement du dashboard:', error.response?.data || error.message);
      setError('Erreur lors du chargement des données. Vérifiez la console pour plus de détails.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Chargement du tableau de bord..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600">{error}</p>
        <Button onClick={loadDashboardData} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble de votre activité agricole
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to="/cultures/nouveau">
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle culture
            </Button>
          </Link>
        </div>
      </div>

      {/* Cartes de statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total cultures */}
          <Card className="stat-card green">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cultures</CardTitle>
              <Sprout className="h-4 w-4 text-agri-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_cultures}</div>
              <p className="text-xs text-muted-foreground">
                Cultures enregistrées
              </p>
            </CardContent>
          </Card>

          {/* Total récoltes */}
          <Card className="stat-card brown">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Récoltes</CardTitle>
              <Package className="h-4 w-4 text-agri-brown" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_recoltes}</div>
              <p className="text-xs text-muted-foreground">
                Récoltes effectuées
              </p>
            </CardContent>
          </Card>

          {/* Revenus totaux */}
          <Card className="stat-card yellow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
              <TrendingUp className="h-4 w-4 text-agri-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {utils.formatCurrency(stats.revenus_totaux)}
              </div>
              <p className="text-xs text-muted-foreground">
                Chiffre d'affaires
              </p>
            </CardContent>
          </Card>

          {/* Bénéfice net */}
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bénéfice Net</CardTitle>
              {stats.benefice_net >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                stats.benefice_net >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {utils.formatCurrency(stats.benefice_net)}
              </div>
              <p className="text-xs text-muted-foreground">
                Profit après dépenses
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Graphiques */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique des revenus/dépenses par mois */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-agri-green" />
                Évolution Revenus vs Dépenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.revenus_par_mois}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip formatter={(value) => utils.formatCurrency(value)} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenus" 
                    stroke="#4CAF50" 
                    strokeWidth={2}
                    name="Revenus"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="depenses" 
                    stroke="#FF5722" 
                    strokeWidth={2}
                    name="Dépenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Graphique des dépenses par catégorie */}
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-agri-brown" />
                Dépenses par Catégorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.depenses_par_categorie}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {chartData.depenses_par_categorie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => utils.formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Informations supplémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Culture la plus rentable */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Culture la plus rentable</p>
                <p className="text-xl font-semibold text-agri-green">
                  {stats.culture_plus_rentable}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rendement moyen</p>
                <p className="text-xl font-semibold">
                  {parseFloat(stats.rendement_moyen).toFixed(2)} kg/ha
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dépenses totales</p>
                <p className="text-xl font-semibold text-red-600">
                  {utils.formatCurrency(stats.depenses_totales)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conseils non lus */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
              Conseils Agricoles
              {conseils.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  {conseils.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {conseils.length > 0 ? (
              <div className="space-y-3">
                {conseils.slice(0, 3).map((conseil) => (
                  <div key={conseil.id} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <h4 className="font-medium text-sm">{conseil.titre}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {conseil.contenu.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`badge ${
                        conseil.priorite === 'haute' ? 'badge-error' :
                        conseil.priorite === 'moyenne' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {conseil.priorite}
                      </span>
                      <span className="text-xs text-gray-500">
                        {utils.formatShortDate(conseil.date_creation)}
                      </span>
                    </div>
                  </div>
                ))}
                {conseils.length > 3 && (
                  <p className="text-sm text-gray-600 text-center">
                    Et {conseils.length - 3} autre(s) conseil(s)...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                Aucun nouveau conseil pour le moment
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/cultures/nouveau">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Sprout className="h-6 w-6 text-agri-green" />
                <span className="text-sm">Nouvelle Culture</span>
              </Button>
            </Link>
            <Link to="/recoltes/nouveau">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Package className="h-6 w-6 text-agri-brown" />
                <span className="text-sm">Nouvelle Récolte</span>
              </Button>
            </Link>
            <Link to="/depenses/nouveau">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <DollarSign className="h-6 w-6 text-red-600" />
                <span className="text-sm">Nouvelle Dépense</span>
              </Button>
            </Link>
            <Link to="/graphiques">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Voir Graphiques</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
