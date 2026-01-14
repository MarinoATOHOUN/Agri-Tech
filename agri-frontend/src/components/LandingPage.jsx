// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
/**
 * Page d'accueil (Landing Page) pour AgriGestion.
 * Conçue pour présenter la vision de BlackBenAI et attirer les utilisateurs.
 */

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
    Cpu
} from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Leaf className="h-8 w-8 text-agri-green" />
                            <span className="ml-2 text-2xl font-bold text-gray-900">AgriGestion</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-agri-green transition-colors">Fonctionnalités</a>
                            <a href="#impact" className="text-gray-600 hover:text-agri-green transition-colors">Impact Afrique</a>
                            <a href="#vision" className="text-gray-600 hover:text-agri-green transition-colors">Notre Vision</a>
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
                                AgriGestion transforme chaque donnée de votre exploitation en levier de croissance.
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
                                AgriGestion n'est pas qu'un outil, c'est une arme contre la pauvreté et pour l'émancipation économique.
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
                        Chaque ligne de code d'AgriGestion est un pas vers un continent souverain et prospère."
                    </p>
                    <div className="mt-12">
                        <p className="font-bold text-gray-900 text-xl">Marino ATOHOUN</p>
                        <p className="text-gray-500">Fondateur & CEO, BlackBenAI</p>
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

            {/* Footer */}
            <footer className="bg-gray-50 py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-2 space-y-6">
                            <div className="flex items-center">
                                <Leaf className="h-8 w-8 text-agri-green" />
                                <span className="ml-2 text-2xl font-bold text-gray-900">AgriGestion</span>
                            </div>
                            <p className="text-gray-500 max-w-sm">
                                Une initiative de BlackBenAI pour l'émancipation technologique et la sécurité alimentaire en Afrique.
                            </p>
                            <div className="flex space-x-4">
                                {/* Social icons placeholders */}
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 w-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:text-agri-green cursor-pointer transition-colors">
                                        <Users className="h-5 w-5" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-6">Produit</h4>
                            <ul className="space-y-4 text-gray-600">
                                <li><a href="#features" className="hover:text-agri-green">Fonctionnalités</a></li>
                                <li><Link to="/register" className="hover:text-agri-green">Tarifs (Gratuit)</Link></li>
                                <li><a href="#" className="hover:text-agri-green">Témoignages</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-6">Entreprise</h4>
                            <ul className="space-y-4 text-gray-600">
                                <li><a href="https://site-web-black-ben-ai.vercel.app/" target="_blank" className="hover:text-agri-green">BlackBenAI</a></li>
                                <li><a href="#" className="hover:text-agri-green">Contact</a></li>
                                <li><a href="#" className="hover:text-agri-green">Confidentialité</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© 2025 AgriGestion par BlackBenAI. Tous droits réservés.</p>
                        <p className="mt-4 md:mt-0">Fait avec ❤️ au Bénin pour l'Afrique.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
