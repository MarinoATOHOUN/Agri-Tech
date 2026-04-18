// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
/**
 * Page d'accueil (Landing Page) pour GreenMetric.
 * Conçue pour présenter la vision de BlackBenAI et attirer les utilisateurs.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    BarChart3,
    ShieldCheck,
    Zap,
    Globe,
    Users,
    TrendingUp,
    Leaf,
    Cpu,
    Sparkles,
    Scan,
    BrainCircuit,
    CheckCircle2,
    Send,
    Loader2,
    Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { newsletterService } from '../services/api';

const LandingPage = () => {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterLoading, setNewsletterLoading] = useState(false);
    const [newsletterStatus, setNewsletterStatus] = useState(null); // 'success', 'error'

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        if (!newsletterEmail) return;

        setNewsletterLoading(true);
        try {
            await newsletterService.subscribe(newsletterEmail);
            setNewsletterStatus('success');
            setNewsletterEmail('');
        } catch (error) {
            console.error('Erreur newsletter:', error);
            setNewsletterStatus('error');
        } finally {
            setNewsletterLoading(false);
            setTimeout(() => setNewsletterStatus(null), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Leaf className="h-8 w-8 text-agri-green" />
                            <span className="ml-2 text-2xl font-bold text-gray-900">GreenMetric</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-agri-green transition-colors">Fonctionnalités</a>
                            <a href="#impact" className="text-gray-600 hover:text-agri-green transition-colors">Impact Afrique</a>
                            <a href="#vision" className="text-gray-600 hover:text-agri-green transition-colors">Notre Vision</a>
                            <Link to="/ia" className="text-gray-600 hover:text-agri-green transition-colors">IA Lab</Link>
                            <Link to="/login" className="text-gray-600 hover:text-agri-green transition-colors">Connexion</Link>
                            <Link to="/register" className="bg-agri-green text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-all shadow-lg shadow-green-200">
                                S'inscrire
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                        <div className="space-y-8 animate-slide-in-left">
                            <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full text-agri-green text-sm font-semibold">
                                <Zap className="h-4 w-4" />
                                <span>Propulsé par BlackBenAI</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                                Révolutionnez votre <span className="text-agri-green">Rendement Agricole</span> par l'IA
                            </h1>
                            <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                                GreenMetric transforme chaque donnée de votre exploitation en levier de croissance.
                                Une solution pensée par des Africains, pour l'émancipation technologique du continent.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link to="/register" className="flex items-center justify-center px-8 py-4 bg-agri-green text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-xl shadow-green-200">
                                    Commencer gratuitement
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                                <a href="#impact" className="flex items-center justify-center px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all">
                                    Découvrir l'impact
                                </a>
                            </div>
                            <div className="flex items-center space-x-6 pt-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Rejoint par plus de <span className="font-bold text-gray-900">500+ agriculteurs</span> pionniers
                                </p>
                            </div>
                        </div>
                        <div className="mt-16 lg:mt-0 relative animate-zoom-in">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                                <img
                                    src="/assets/hero.png"
                                    alt="Agriculteur moderne avec technologie"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-agri-green py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                        <div className="space-y-2">
                            <div className="text-4xl font-bold">+35%</div>
                            <div className="text-green-100 text-sm">Augmentation du rendement</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold">-20%</div>
                            <div className="text-green-100 text-sm">Réduction des pertes</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold">100%</div>
                            <div className="text-green-100 text-sm">Données sécurisées</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold">24/7</div>
                            <div className="text-green-100 text-sm">Support IA personnalisé</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-agri-green font-bold tracking-wide uppercase text-sm mb-3">Fonctionnalités Clés</h2>
                        <p className="text-4xl font-extrabold text-gray-900 mb-6">
                            Tout ce dont vous avez besoin pour dominer votre marché
                        </p>
                        <p className="text-gray-600 text-lg">
                            Notre plateforme combine simplicité d'utilisation et puissance d'analyse pour vous offrir une expérience sans précédent.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
                                title: "Analyses Prédictives",
                                desc: "Anticipez vos récoltes et vos revenus grâce à nos algorithmes d'IA entraînés sur les sols africains."
                            },
                            {
                                icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
                                title: "Gestion Budgétaire",
                                desc: "Suivez chaque centime investi. Identifiez instantanément les postes de dépenses à optimiser."
                            },
                            {
                                icon: <Globe className="h-8 w-8 text-purple-500" />,
                                title: "Accès Partout",
                                desc: "Que vous soyez au champ ou en ville, accédez à vos données sur mobile, tablette ou ordinateur."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                                <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Innovation Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-agri-green/10 rounded-full blur-3xl"></div>
                            <div className="relative bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">AgriVision Live</span>
                                        </div>
                                        <BrainCircuit className="h-6 w-6 text-agri-green" />
                                    </div>
                                    <div className="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                                        <div className="relative z-10 text-center">
                                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full mb-3 inline-block">
                                                <Scan className="h-8 w-8 text-white" />
                                            </div>
                                            <p className="text-white text-sm font-bold">Scan en cours...</p>
                                        </div>
                                        <div className="absolute top-0 left-0 w-full h-1 bg-agri-green shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-scan"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                            <p className="text-slate-500 text-[10px] uppercase font-bold">Précision</p>
                                            <p className="text-white text-xl font-black">98.4%</p>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                            <p className="text-slate-500 text-[10px] uppercase font-bold">Latence</p>
                                            <p className="text-white text-xl font-black">45ms</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8 order-1 lg:order-2">
                            <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full text-agri-green text-sm font-semibold">
                                <Sparkles className="h-4 w-4" />
                                <span>Futur & Innovation</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                                L'Intelligence Artificielle qui <span className="text-agri-green">comprend</span> votre terre.
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Avec BlackBenAI, nous repoussons les limites. Nos futurs modèles de Computer Vision et de Deep Learning détecteront les maladies avant même qu'elles ne soient visibles à l'œil nu.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Détection automatique des mauvaises herbes",
                                    "Identification instantanée des insectes nuisibles",
                                    "Optimisation prédictive des cycles de culture",
                                    "Conseiller agronomique LLM multilingue"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center space-x-3 text-gray-700 font-medium">
                                        <div className="bg-agri-green rounded-full p-1">
                                            <CheckCircle2 className="h-3 w-3 text-white" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/ia" className="inline-flex items-center text-agri-green font-bold text-lg hover:underline group">
                                Explorer le IA Lab
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* Impact Section */}
            <section id="impact" className="py-24 relative overflow-hidden bg-gray-900 text-white">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
                    <img src="/assets/impact.png" alt="Impact IA Afrique" className="w-full h-full object-cover" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                                L'Afrique, Nouvelle Puissance <span className="text-agri-green">Agro-Technologique</span>
                            </h2>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Chez <span className="text-white font-bold">BlackBenAI</span>, nous croyons que la sécurité alimentaire de l'Afrique passera par l'intelligence artificielle.
                                GreenMetric n'est pas qu'un outil, c'est une arme contre la pauvreté et pour l'émancipation économique.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { title: "Sécurité Alimentaire", desc: "Réduire les pertes post-récolte de 40% grâce à une meilleure planification." },
                                    { title: "Indépendance Économique", desc: "Permettre aux agriculteurs de devenir de véritables entrepreneurs rentables." },
                                    { title: "Innovation Locale", desc: "Des modèles IA construits sur nos réalités, pas importés d'ailleurs." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start space-x-4">
                                        <div className="bg-agri-green/20 p-2 rounded-lg">
                                            <TrendingUp className="h-6 w-6 text-agri-green" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold">{item.title}</h4>
                                            <p className="text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section id="vision" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-block p-4 bg-green-50 rounded-2xl mb-8">
                        <Cpu className="h-12 w-12 text-agri-green" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-8">La Vision BlackBenAI</h2>
                    <p className="text-2xl text-gray-600 max-w-4xl mx-auto italic leading-relaxed">
                        "Nous ne construisons pas seulement des logiciels. Nous construisons l'avenir technologique de l'Afrique.
                        Chaque ligne de code de GreenMetric est un pas vers un continent souverain et prospère."
                    </p>
                    <div className="mt-12">
                        <p className="text-gray-500 font-bold">Fondateur & CEO, BlackBenAI</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-agri-green rounded-3xl p-12 text-center text-white shadow-2xl shadow-green-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <Globe className="w-full h-full scale-150" />
                        </div>
                        <h2 className="text-4xl font-bold mb-6 relative z-10">Prêt à transformer votre exploitation ?</h2>
                        <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto relative z-10">
                            Rejoignez la révolution agricole africaine dès aujourd'hui. L'inscription est gratuite et ne prend que 2 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                            <Link to="/register" className="px-10 py-4 bg-white text-agri-green rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg">
                                Créer mon compte
                            </Link>
                            <Link to="/login" className="px-10 py-4 bg-green-700 text-white rounded-xl font-bold text-lg hover:bg-green-800 transition-all border border-green-500">
                                Se connecter
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-agri-green/5 -z-10" />
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-green-100/50 border border-green-50 relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-agri-green/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-agri-brown/5 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-50 text-agri-green rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                    <Sparkles className="h-3 w-3" />
                                    <span>Restez Informé</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                                    Cultivons ensemble <br />
                                    <span className="text-agri-green">l'agriculture de demain</span>
                                </h2>
                                <p className="text-gray-500 text-lg">
                                    Recevez chaque semaine nos meilleurs conseils, analyses de marché et actualités tech directement dans votre boîte mail.
                                </p>
                            </div>
                            
                            <div>
                                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-agri-green transition-colors" />
                                        </div>
                                        <Input
                                            type="email"
                                            placeholder="votre@email.com"
                                            value={newsletterEmail}
                                            onChange={(e) => setNewsletterEmail(e.target.value)}
                                            className="h-16 pl-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-agri-green transition-all text-lg"
                                            disabled={newsletterLoading}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={newsletterLoading}
                                        className="w-full h-16 rounded-2xl bg-agri-green hover:bg-agri-dark-green text-white text-lg font-bold shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
                                    >
                                        {newsletterLoading ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <span>S'abonner maintenant</span>
                                                <Send className="h-5 w-5" />
                                            </div>
                                        )}
                                    </Button>
                                    
                                    {newsletterStatus === 'success' && (
                                        <div className="flex items-center space-x-2 text-agri-green bg-green-50 p-3 rounded-xl animate-in fade-in zoom-in">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span className="text-sm font-bold">Bienvenue dans la communauté !</span>
                                        </div>
                                    )}
                                    
                                    {newsletterStatus === 'error' && (
                                        <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-3 rounded-xl animate-in fade-in zoom-in">
                                            <ShieldCheck className="h-5 w-5" />
                                            <span className="text-sm font-bold">Erreur. Veuillez vérifier votre email.</span>
                                        </div>
                                    )}
                                    
                                    <p className="text-center text-xs text-gray-400">
                                        Pas de spam. Désabonnez-vous à tout moment.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-16 mb-16">
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <Leaf className="h-8 w-8 text-agri-green" />
                                <span className="ml-2 text-2xl font-bold">GreenMetric</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Transformer l'agriculture africaine par l'intelligence artificielle. Une initiative de BlackBenAI pour un continent prospère.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-bold mb-8 uppercase text-xs tracking-widest text-agri-green">Navigation</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                                <li><Link to="/register" className="hover:text-white transition-colors">Tarifs & Inscription</Link></li>
                                <li><a href="https://www.blackbenai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">BlackBenAI</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-8 uppercase text-xs tracking-widest text-agri-green">Légal & Contact</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><Link to="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                                <li><Link to="/terms" className="hover:text-white transition-colors">Conditions Générales</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Nous contacter</Link></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© 2025 GreenMetric par BlackBenAI. Tous droits réservés.</p>
                        <p className="mt-4 md:mt-0 italic font-medium text-agri-green/60">
                            "Quand la technologie rencontre la terre, l'Afrique cultive son propre destin."
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
