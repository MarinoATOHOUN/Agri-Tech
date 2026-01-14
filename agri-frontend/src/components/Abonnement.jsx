// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
/**
 * Composant Abonnement pour présenter les plans de pricing.
 */

import { Check, Zap, Crown, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Abonnement = () => {
    const plans = [
        {
            name: "Gratuit",
            price: "0",
            description: "Pour les petits exploitants qui débutent.",
            icon: <Zap className="h-6 w-6 text-gray-400" />,
            features: [
                "Jusqu'à 3 cultures actives",
                "Suivi des récoltes de base",
                "Historique des dépenses",
                "Chatbot IA (5 messages/jour)",
                "Support par email"
            ],
            buttonText: "Plan Actuel",
            buttonVariant: "outline",
            popular: false
        },
        {
            name: "Professionnel",
            price: "5 000",
            description: "Pour les agriculteurs ambitieux qui veulent optimiser leur rendement.",
            icon: <Crown className="h-6 w-6 text-agri-green" />,
            features: [
                "Cultures illimitées",
                "Analyses avancées & Graphiques",
                "Chatbot IA illimité",
                "Rapports PDF personnalisés",
                "Conseils agricoles prioritaires",
                "Exportation de données CSV/Excel"
            ],
            buttonText: "Passer au Pro",
            buttonVariant: "default",
            popular: true
        },
        {
            name: "Expert / Coopérative",
            price: "25 000",
            description: "Pour les grandes exploitations et les coopératives agricoles.",
            icon: <Building2 className="h-6 w-6 text-blue-600" />,
            features: [
                "Tout le plan Professionnel",
                "Multi-utilisateurs (jusqu'à 10)",
                "Gestion de flotte de matériel",
                "Support prioritaire 24/7",
                "Formation personnalisée par nos experts",
                "Accès API pour intégration tierce"
            ],
            buttonText: "Contacter l'équipe",
            buttonVariant: "outline",
            popular: false
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                    Choisissez le plan qui vous <span className="text-agri-green">propulse</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Des solutions adaptées à chaque étape de votre croissance agricole.
                    Investissez dans la technologie pour transformer votre terre.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan, index) => (
                    <Card
                        key={index}
                        className={`relative flex flex-col h-full transition-all hover:shadow-2xl ${plan.popular ? 'border-agri-green border-2 shadow-xl scale-105 z-10' : 'border-gray-100'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-agri-green text-white px-4 py-1 rounded-full text-sm font-bold">
                                Plus Populaire
                            </div>
                        )}

                        <CardHeader className="text-center pb-8">
                            <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                                {plan.icon}
                            </div>
                            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                            <div className="mt-4 flex items-baseline justify-center">
                                <span className="text-4xl font-extrabold tracking-tight text-gray-900">{plan.price}</span>
                                <span className="ml-1 text-xl font-semibold text-gray-500">FCFA/mois</span>
                            </div>
                            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                                {plan.description}
                            </p>
                        </CardHeader>

                        <CardContent className="flex-grow">
                            <ul className="space-y-4">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start">
                                        <div className="flex-shrink-0 bg-green-50 rounded-full p-1">
                                            <Check className="h-4 w-4 text-agri-green" />
                                        </div>
                                        <span className="ml-3 text-sm text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="pt-8">
                            <Button
                                className={`w-full py-6 text-lg font-bold rounded-xl transition-all ${plan.popular
                                        ? 'bg-agri-green hover:bg-green-600 text-white shadow-lg shadow-green-100'
                                        : 'bg-white border-2 border-gray-100 hover:border-agri-green hover:text-agri-green'
                                    }`}
                                variant={plan.buttonVariant}
                            >
                                {plan.buttonText}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="mt-20 bg-gray-900 rounded-3xl p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-agri-green/10 blur-3xl rounded-full" />
                <div className="relative z-10 lg:flex items-center justify-between">
                    <div className="lg:max-w-2xl">
                        <h2 className="text-3xl font-bold mb-4">Besoin d'une solution sur mesure ?</h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Vous représentez un gouvernement, une ONG ou une très grande coopérative ?
                            Nous pouvons adapter AgriGestion à vos besoins spécifiques avec des intégrations personnalisées.
                        </p>
                        <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl">
                            Discuter avec un expert
                        </Button>
                    </div>
                    <div className="mt-12 lg:mt-0 lg:ml-12">
                        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                            <p className="italic text-gray-300 mb-4">
                                "AgriGestion a transformé ma façon de voir mon exploitation. Je ne suis plus juste un cultivateur, je suis un chef d'entreprise."
                            </p>
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-agri-green mr-3" />
                                <div>
                                    <p className="font-bold">Moussa Traoré</p>
                                    <p className="text-xs text-gray-500">Agriculteur, Plan Pro</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Abonnement;
