// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)

import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const Terms = () => {
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
                            <FileText className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Conditions Générales d'Utilisation</h1>
                            <p className="text-gray-500 mt-1">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
                        </div>
                    </div>

                    <div className="space-y-8 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Objet</h2>
                            <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme GreenMetric, développée par BlackBenAI. En créant un compte, vous acceptez sans réserve ces conditions.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Services fournis</h2>
                            <p>GreenMetric fournit des outils de gestion agricole, de suivi financier et des conseils basés sur l'Intelligence Artificielle. Bien que nous nous efforcions de fournir les meilleures recommandations possibles, l'IA ne remplace pas l'expertise d'un agronome de terrain. Les décisions prises sur la base de nos conseils relèvent de votre seule responsabilité.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Utilisation de la Marketplace</h2>
                            <p>La marketplace permet la mise en relation entre agriculteurs et acheteurs. GreenMetric n'est pas partie prenante aux transactions commerciales qui s'y déroulent. Nous ne garantissons ni la qualité des produits, ni la solvabilité des acheteurs. Les utilisateurs s'engagent à publier des informations exactes et à jour.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
                            <p>L'ensemble des éléments constituant GreenMetric (code source, algorithmes, design, textes) est la propriété exclusive de BlackBenAI. Toute reproduction ou utilisation non autorisée est strictement interdite.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Modification des CGU</h2>
                            <p>Nous nous réservons le droit de modifier ces conditions à tout moment pour les adapter aux évolutions de la plateforme ou de la législation. Les utilisateurs seront informés des modifications substantielles.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
