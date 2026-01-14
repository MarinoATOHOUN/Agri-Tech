// © 2025 - Développé par Marino ATOHOUN (RinoGeek)
import React, { useState, useEffect } from 'react';
import { rapportService, utils } from '../services/api';
import {
    FileText,
    Download,
    Sparkles,
    BarChart3,
    TrendingUp,
    Lightbulb
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import ReactMarkdown from 'react-markdown';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await rapportService.getAll();
            // Gérer la pagination Django REST Framework (results) ou une liste directe
            const data = response.results || response;

            if (Array.isArray(data)) {
                setReports(data);
                if (data.length > 0) {
                    setSelectedReport(data[0]);
                }
            } else {
                console.error("Format de données invalide:", response);
                setReports([]);
            }
        } catch (err) {
            console.error("Erreur chargement rapports:", err);
            setError("Impossible de charger les rapports.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        setGenerating(true);
        setError(null);
        try {
            const newReport = await rapportService.generate();
            setReports([newReport, ...reports]);
            setSelectedReport(newReport);
        } catch (err) {
            console.error("Erreur génération rapport:", err);
            setError("Erreur lors de la génération du rapport. Veuillez réessayer plus tard.");
        } finally {
            setGenerating(false);
        }
    };

    const downloadPdf = (pdfUrl) => {
        if (!pdfUrl) return;

        // Si l'URL est déjà absolue (commence par http), on l'ouvre directement
        if (pdfUrl.startsWith('http')) {
            window.open(pdfUrl, '_blank');
            return;
        }

        const baseUrl = 'http://localhost:8000'; // A adapter selon l'env

        // Si l'URL commence par /, on l'ajoute directement à la base URL
        // (ex: /media/rapports_pdf/...)
        if (pdfUrl.startsWith('/')) {
            window.open(`${baseUrl}${pdfUrl}`, '_blank');
        } else {
            // Sinon, on suppose que c'est un chemin relatif au dossier media
            window.open(`${baseUrl}/media/${pdfUrl}`, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Rapports d'Analyse IA</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Analyses détaillées de votre exploitation générées par l'intelligence artificielle.
                    </p>
                </div>
                <button
                    onClick={handleGenerateReport}
                    disabled={generating}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${generating ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                >
                    {generating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Génération en cours...
                        </>
                    ) : (
                        <>
                            <Sparkles className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Générer un nouveau rapport
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Liste des rapports (Sidebar) */}
                <div className="lg:col-span-1 bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-medium text-gray-900">Historique</h2>
                    </div>
                    <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                        {reports.length === 0 ? (
                            <li className="p-4 text-center text-gray-500 text-sm">
                                Aucun rapport généré pour le moment.
                            </li>
                        ) : (
                            reports.map((report) => (
                                <li
                                    key={report.id}
                                    onClick={() => setSelectedReport(report)}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedReport?.id === report.id ? 'bg-green-50 border-l-4 border-green-500' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className={`text-sm font-medium ${selectedReport?.id === report.id ? 'text-green-700' : 'text-gray-900'
                                                }`}>
                                                {report.titre}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {utils.formatDate(report.date_creation)}
                                            </p>
                                        </div>
                                        {report.pdf_file && (
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Contenu du rapport sélectionné */}
                <div className="lg:col-span-3 space-y-6">
                    {selectedReport ? (
                        <>
                            {/* En-tête du rapport */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedReport.titre}</h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Généré le {utils.formatDate(selectedReport.date_creation)}
                                        </p>
                                    </div>
                                    {selectedReport.pdf_file ? (
                                        <button
                                            onClick={() => downloadPdf(selectedReport.pdf_file)}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <Download className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                                            Télécharger PDF
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">PDF non disponible</span>
                                    )}
                                </div>
                            </div>

                            {/* Graphiques */}
                            {selectedReport.donnees_graphiques && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Évolution Financière */}
                                    {selectedReport.donnees_graphiques.evolution_financiere && (
                                        <div className="bg-white shadow rounded-lg p-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                                                Évolution Financière
                                            </h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={selectedReport.donnees_graphiques.evolution_financiere}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="label" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="revenus" name="Revenus" fill="#10B981" />
                                                        <Bar dataKey="depenses" name="Dépenses" fill="#EF4444" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}

                                    {/* Répartition Dépenses */}
                                    {selectedReport.donnees_graphiques.repartition_depenses && (
                                        <div className="bg-white shadow rounded-lg p-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                                                Répartition des Dépenses
                                            </h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={selectedReport.donnees_graphiques.repartition_depenses}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {selectedReport.donnees_graphiques.repartition_depenses.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Analyse Complète */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                                    Analyse Détaillée
                                </h3>
                                <div className="prose prose-green max-w-none text-gray-700">
                                    <ReactMarkdown>{selectedReport.analyse_complete}</ReactMarkdown>
                                </div>
                            </div>

                            {/* Propositions d'Amélioration */}
                            <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-400">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                                    Pistes d'Amélioration
                                </h3>
                                <div className="prose prose-yellow max-w-none text-gray-700">
                                    <ReactMarkdown>{selectedReport.propositions_amelioration}</ReactMarkdown>
                                </div>
                            </div>

                            {/* Points de Progression */}
                            <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-400">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                                    Progression
                                </h3>
                                <div className="prose prose-green max-w-none text-gray-700">
                                    <ReactMarkdown>{selectedReport.points_progression}</ReactMarkdown>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white shadow rounded-lg p-12 text-center">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rapport sélectionné</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Sélectionnez un rapport dans la liste ou générez-en un nouveau.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={handleGenerateReport}
                                    disabled={generating}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    {generating ? 'Génération...' : 'Générer mon premier rapport'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
