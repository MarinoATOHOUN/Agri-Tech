// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contactService } from '../services/api';

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        sujet: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await contactService.sendMessage(formData);
            setSuccess(true);
            setFormData({ nom: '', email: '', sujet: '', message: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error('Erreur lors de l\'envoi du message:', err);
            setError("Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-agri-green mb-8 transition-colors group">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Retour à l'accueil
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                    <div className="grid md:grid-cols-2">
                        {/* Section Informations */}
                        <div className="bg-agri-green p-10 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                            
                            <div className="relative z-10">
                                <h1 className="text-4xl font-black mb-4">Contactez-nous</h1>
                                <p className="text-green-50 text-lg mb-12">
                                    Une question, une suggestion ou besoin d'accompagnement pour votre coopérative ? Notre équipe est là pour vous.
                                </p>

                                <div className="space-y-8">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white/10 p-3 rounded-xl">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Email</h3>
                                            <p className="text-green-100">contact@blackbenai.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white/10 p-3 rounded-xl">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Téléphone</h3>
                                            <p className="text-green-100">+229 01 23 45 67 89</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="bg-white/10 p-3 rounded-xl">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Siège Social</h3>
                                            <p className="text-green-100">Cotonou, Bénin</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulaire de contact */}
                        <div className="p-10 md:p-16">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
                            
                            {success ? (
                                <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-8 text-center animate-in zoom-in">
                                    <CheckCircle2 className="h-12 w-12 text-agri-green mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Message envoyé !</h3>
                                    <p>Nous vous répondrons dans les plus brefs délais.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium">
                                            {error}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Nom complet</label>
                                            <Input name="nom" value={formData.nom} onChange={handleChange} required className="h-12 rounded-xl bg-gray-50/50 border-gray-100" placeholder="Votre nom" disabled={loading} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                                            <Input type="email" name="email" value={formData.email} onChange={handleChange} required className="h-12 rounded-xl bg-gray-50/50 border-gray-100" placeholder="votre@email.com" disabled={loading} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Sujet</label>
                                        <Input name="sujet" value={formData.sujet} onChange={handleChange} required className="h-12 rounded-xl bg-gray-50/50 border-gray-100" placeholder="Comment pouvons-nous vous aider ?" disabled={loading} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                                        <textarea 
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required 
                                            className="w-full h-32 p-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-agri-green outline-none resize-none" 
                                            placeholder="Votre message..."
                                            disabled={loading}
                                        />
                                    </div>

                                    <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-agri-green hover:bg-agri-dark-green text-white text-lg font-bold">
                                        {loading ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <span>Envoyer le message</span>
                                                <Send className="h-5 w-5" />
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
