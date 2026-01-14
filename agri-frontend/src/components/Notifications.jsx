// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
/**
 * Composant pour afficher les notifications et conseils agricoles.
 */

import { useState, useEffect } from 'react';
import {
    Bell,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Info,
    Sprout,
    TrendingUp,
    DollarSign,
    Wrench,
    Calendar,
    Check
} from 'lucide-react';
import { conseilService, utils } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { Button } from '@/components/ui/button';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await conseilService.getAll();
            setNotifications(data.results || data);
            setError(null);
        } catch (err) {
            console.error('Erreur lors de la récupération des notifications:', err);
            setError('Impossible de charger les notifications.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await conseilService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, lu: true } : n)
            );
        } catch (err) {
            console.error('Erreur lors du marquage comme lu:', err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'culture': return <Sprout className="h-5 w-5 text-green-500" />;
            case 'rendement': return <TrendingUp className="h-5 w-5 text-blue-500" />;
            case 'economique': return <DollarSign className="h-5 w-5 text-amber-500" />;
            case 'technique': return <Wrench className="h-5 w-5 text-gray-500" />;
            case 'saisonnier': return <Calendar className="h-5 w-5 text-purple-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgente': return 'bg-red-100 text-red-800 border-red-200';
            case 'haute': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'moyenne': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'basse': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notifications & Conseils</h2>
                    <p className="text-gray-500">Retrouvez ici vos alertes et recommandations personnalisées.</p>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-agri-green" />
                    <span className="font-semibold text-gray-700">
                        {notifications.filter(n => !n.lu).length} non lues
                    </span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            )}

            {notifications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Bell className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Aucune notification</h3>
                    <p className="text-gray-500 mt-1">Vous n'avez pas encore de conseils ou d'alertes.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`
                relative bg-white rounded-xl shadow-sm border transition-all duration-200 p-5
                ${notification.lu ? 'border-gray-200 opacity-80' : 'border-agri-green/30 ring-1 ring-agri-green/5'}
              `}
                        >
                            {!notification.lu && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-agri-green rounded-l-xl" />
                            )}

                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-lg bg-gray-50 border border-gray-100`}>
                                        {getIcon(notification.type_conseil)}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className={`font-bold text-lg ${notification.lu ? 'text-gray-700' : 'text-gray-900'}`}>
                                                {notification.titre}
                                            </h3>
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(notification.priorite)}`}>
                                                {notification.priorite}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-3">
                                            {notification.contenu}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                                            <div className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {utils.formatDate(notification.date_creation)}
                                            </div>
                                            <div className="capitalize">
                                                {notification.type_conseil.replace('_', ' ')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!notification.lu && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="flex-shrink-0 border-agri-green text-agri-green hover:bg-agri-green hover:text-white"
                                    >
                                        <Check className="h-4 w-4 mr-1" />
                                        Marquer comme lu
                                    </Button>
                                )}
                                {notification.lu && (
                                    <div className="flex items-center text-green-600 text-sm font-medium">
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        Lu
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
