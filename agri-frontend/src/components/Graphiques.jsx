// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
/**
 * Composant Graphiques pour l'affichage des graphiques et analyses.
 */

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardService, utils } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const Graphiques = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12months');

  const COLORS = ['#4CAF50', '#8D6E63', '#FFEB3B', '#FF9800', '#2196F3', '#9C27B0', '#F44336'];

  const periodOptions = [
    { value: '3months', label: '3 derniers mois' },
    { value: '6months', label: '6 derniers mois' },
    { value: '12months', label: '12 derniers mois' },
    { value: 'all', label: 'Toute la période' }
  ];

  useEffect(() => {
    loadChartData();
  }, [selectedPeriod]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getChartData({ period: selectedPeriod });
      setChartData(data);
    } catch (error) {
      console.error('Erreur lors du chargement des graphiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return utils.formatCurrency(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('fr-FR').format(value);
  };

  if (loading) {
    return <LoadingSpinner text="Chargement des graphiques..." />;
  }

  if (!chartData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Erreur lors du chargement des données</p>
        <Button onClick={loadChartData} className="mt-4">
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
          <h1 className="text-3xl font-bold text-gray-900">Graphiques et Analyses</h1>
          <p className="text-gray-600 mt-1">
            Visualisez vos performances agricoles et tendances
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="form-select"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des revenus et dépenses */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-agri-green" />
              Évolution Revenus vs Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.revenus_par_mois}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenus" 
                  stroke="#4CAF50" 
                  strokeWidth={3}
                  name="Revenus"
                  dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="depenses" 
                  stroke="#FF5722" 
                  strokeWidth={3}
                  name="Dépenses"
                  dot={{ fill: '#FF5722', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des dépenses par catégorie */}
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-agri-brown" />
              Dépenses par Catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
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
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques secondaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rendement par culture */}
        {chartData.rendement_par_culture && chartData.rendement_par_culture.length > 0 && (
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Rendement par Culture (kg/ha)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.rendement_par_culture}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nom" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} kg/ha`} />
                  <Bar dataKey="rendement" fill="#2196F3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Bénéfice par culture */}
        {chartData.benefice_par_culture && chartData.benefice_par_culture.length > 0 && (
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Bénéfice par Culture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.benefice_par_culture}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nom" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar 
                    dataKey="benefice" 
                    fill="#4CAF50"
                    name="Bénéfice"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Graphique de tendance cumulative */}
      {chartData.tendance_cumulative && (
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Tendance Cumulative des Bénéfices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData.tendance_cumulative}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="benefice_cumule"
                  stroke="#9C27B0"
                  fill="#9C27B0"
                  fillOpacity={0.3}
                  name="Bénéfice Cumulé"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Métriques de performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">ROI Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {chartData.roi_moyen ? `${chartData.roi_moyen.toFixed(1)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Retour sur investissement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Marge Bénéficiaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {chartData.marge_beneficiaire ? `${chartData.marge_beneficiaire.toFixed(1)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Pourcentage de profit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Productivité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {chartData.productivite_moyenne ? `${chartData.productivite_moyenne.toFixed(0)} kg/ha` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Rendement moyen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Efficacité Coûts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {chartData.efficacite_couts ? `${chartData.efficacite_couts.toFixed(2)}` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenus/Dépenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights et recommandations */}
      {chartData.insights && chartData.insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Insights et Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.insights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'success' ? 'border-l-green-500 bg-green-50' :
                  insight.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                  insight.type === 'info' ? 'border-l-blue-500 bg-blue-50' :
                  'border-l-red-500 bg-red-50'
                }`}>
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                  {insight.recommendation && (
                    <p className="text-sm font-medium text-gray-800 mt-2">
                      💡 {insight.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparaison avec les objectifs */}
      {chartData.objectifs && (
        <Card>
          <CardHeader>
            <CardTitle>Progression vers les Objectifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(chartData.objectifs).map(([key, objectif]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{objectif.nom}</span>
                    <span className="text-sm text-gray-600">
                      {objectif.actuel} / {objectif.cible} ({objectif.pourcentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        objectif.pourcentage >= 100 ? 'bg-green-600' :
                        objectif.pourcentage >= 75 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(objectif.pourcentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Graphiques;
