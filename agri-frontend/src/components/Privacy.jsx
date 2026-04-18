// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)

import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto w-full">
                <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-agri-green mb-8 transition-colors group">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Retour à l'accueil
                </Link>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 sm:p-12 border border-gray-100">
                    <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-100">
                        <div className="p-3 bg-green-50 text-agri-green rounded-2xl">
                            <Shield className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Politique de Confidentialité</h1>
                            <p className="text-gray-500 mt-1">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
                        </div>
                    </div>

                    <div className="space-y-8 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Collecte des données</h2>
                            <p>Nous collectons les informations que vous nous fournissez directement lors de la création de votre compte (nom, prénom, email, type d'agriculture, localisation). L'application collecte également des données liées à vos cultures, récoltes et dépenses pour générer des statistiques et des conseils personnalisés via l'Intelligence Artificielle.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Utilisation de vos données</h2>
                            <p>Vos données sont utilisées exclusivement pour :</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Vous fournir le service GreenMetric et gérer votre compte.</li>
                                <li>Générer des analyses, des rapports financiers et des conseils agricoles via l'IA.</li>
                                <li>Améliorer nos algorithmes et la précision de nos modèles adaptés à l'agriculture africaine.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Sécurité et Partage</h2>
                            <p>Nous mettons en œuvre des mesures de sécurité strictes pour protéger vos données contre tout accès non autorisé. Vos informations personnelles ne sont jamais vendues à des tiers. Les données peuvent être partagées avec nos partenaires technologiques (comme les fournisseurs d'IA) de manière sécurisée et anonymisée lorsque cela est strictement nécessaire au fonctionnement du service.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Vos droits</h2>
                            <p>Conformément à la réglementation, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez exercer ce droit à tout moment depuis les paramètres de votre compte ou en nous contactant directement.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
