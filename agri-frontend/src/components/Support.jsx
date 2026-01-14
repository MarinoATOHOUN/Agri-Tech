// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
/**
 * Composant Support pour permettre aux utilisateurs de contacter les administrateurs.
 */

import { useState, useEffect } from 'react';
import {
    LifeBuoy,
    Send,
    MessageSquare,
    Lightbulb,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supportService, utils } from '../services/api';

const Support = () => {
    const [formData, setFormData] = useState({
        sujet: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const data = await supportService.getAll();
            setMessages(data.results || data);
        } catch (err) {
            console.error('Erreur lors de la récupération des messages:', err);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.sujet || !formData.message) return;

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await supportService.send(formData);
            setSuccess(true);
            setFormData({ sujet: '', message: '' });
            fetchMessages();
        } catch (err) {
            setError('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-full shadow-lg shadow-blue-100">
                    <LifeBuoy className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Support & Propositions</h1>
                    <p className="text-gray-600 mt-1">
                        Besoin d'aide ou une idée pour améliorer AgriGestion ? Nous sommes à votre écoute.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Formulaire de contact */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-xl shadow-gray-100 overflow-hidden">
                        <div className="h-2 bg-blue-600 w-full" />
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center">
                                <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                                Envoyer un message
                            </CardTitle>
                            <CardDescription>
                                Expliquez-nous votre problème ou partagez votre proposition d'amélioration.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {success && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center animate-in fade-in zoom-in">
                                        <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" />
                                        <p className="text-sm font-medium">Votre message a été envoyé avec succès ! Notre équipe vous répondra bientôt.</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center">
                                        <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label htmlFor="sujet" className="text-sm font-semibold text-gray-700">Sujet</label>
                                    <Input
                                        id="sujet"
                                        name="sujet"
                                        placeholder="Ex: Problème de connexion, Suggestion de fonctionnalité..."
                                        value={formData.sujet}
                                        onChange={handleChange}
                                        required
                                        className="rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold text-gray-700">Votre message</label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Détaillez votre demande ici..."
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-blue-100 transition-all transform hover:scale-[1.02]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-5 w-5" />
                                            Envoyer le message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Historique des messages */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Clock className="mr-2 h-5 w-5 text-gray-400" />
                            Vos échanges récents
                        </h2>

                        {fetching ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
                                <p className="text-gray-500">Vous n'avez pas encore envoyé de message au support.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <Card key={msg.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{msg.sujet}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Envoyé le {utils.formatDate(msg.date_envoi)}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${msg.traite
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {msg.traite ? 'Traité' : 'En attente'}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm line-clamp-3">
                                                {msg.message}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar d'infos */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Lightbulb className="mr-2 h-5 w-5" />
                                Conseils
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-blue-50">
                            <p className="text-sm leading-relaxed">
                                Pour une réponse plus rapide, essayez d'être le plus précis possible dans votre description.
                            </p>
                            <div className="pt-4 border-t border-blue-500/30">
                                <h4 className="font-bold mb-2">Temps de réponse moyen</h4>
                                <p className="text-2xl font-bold text-white">Moins de 24h</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Autres moyens</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                <div className="bg-white p-2 rounded-lg shadow-sm mr-3">
                                    <Send className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email direct</p>
                                    <p className="text-sm font-bold">support@blackbenai.com</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                <div className="bg-white p-2 rounded-lg shadow-sm mr-3">
                                    <MessageSquare className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">WhatsApp</p>
                                    <p className="text-sm font-bold">+229 00 00 00 00</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Support;
