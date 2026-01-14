// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
/**
 * Composant AILab pour présenter les futures innovations IA d'AgriGestion.
 */

import { useState } from 'react';
import {
    Cpu,
    Scan,
    Bug,
    Sprout,
    LineChart,
    MessageSquare,
    Zap,
    Loader2,
    Camera,
    CheckCircle2,
    AlertTriangle,
    Info,
    ArrowRight,
    BrainCircuit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const AILab = () => {
    const [activeSimulation, setActiveSimulation] = useState(null);
    const [simulating, setSimulating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);

    const aiModels = [
        {
            id: 'vision',
            name: 'AgriVision CV',
            tag: 'Computer Vision',
            description: 'Détection en temps réel des mauvaises herbes et des insectes nuisibles via caméra.',
            icon: Scan,
            color: 'bg-blue-500',
            status: 'En développement',
            simulation: {
                title: 'Analyse d\'image en cours...',
                steps: ['Chargement du modèle neural...', 'Segmentation de l\'image...', 'Identification des espèces...', 'Calcul du taux d\'infestation...'],
                finalResult: {
                    type: 'success',
                    message: 'Analyse terminée : 3 foyers de Chenilles Légionnaires détectés. Recommandation : Traitement localisé au Neem.',
                    data: 'Confiance : 98.4%'
                }
            }
        },
        {
            id: 'predict',
            name: 'AgriPredict',
            tag: 'Predictive Analytics',
            description: 'Optimisation des rendements basée sur les données climatiques et historiques.',
            icon: LineChart,
            color: 'bg-purple-500',
            status: 'Phase de test Alpha',
            simulation: {
                title: 'Calcul des prédictions...',
                steps: ['Extraction des données météo...', 'Analyse du cycle de croissance...', 'Simulation de stress hydrique...', 'Génération du rapport de rendement...'],
                finalResult: {
                    type: 'info',
                    message: 'Prédiction : Rendement estimé à +15% par rapport à l\'année dernière si irrigation maintenue.',
                    data: 'Précision : 92%'
                }
            }
        },
        {
            id: 'talk',
            name: 'AgriTalk LLM',
            tag: 'Large Language Model',
            description: 'Assistant expert capable de répondre à toutes vos questions techniques agricoles.',
            icon: MessageSquare,
            color: 'bg-green-500',
            status: 'En cours d\'entraînement',
            simulation: {
                title: 'Génération de réponse...',
                steps: ['Analyse de la requête...', 'Consultation de la base de connaissances...', 'Synthèse agronomique...', 'Optimisation du langage...'],
                finalResult: {
                    type: 'success',
                    message: 'AgriTalk : Pour lutter contre la rouille du maïs, privilégiez des variétés résistantes et assurez une rotation des cultures.',
                    data: 'Source : FAO & Experts Locaux'
                }
            }
        },
        {
            id: 'market',
            name: 'AgriMarket AI',
            tag: 'Market Intelligence',
            description: 'Analyse des tendances du marché pour vendre vos produits au meilleur prix.',
            icon: Zap,
            color: 'bg-orange-500',
            status: 'Conception',
            simulation: {
                title: 'Analyse du marché...',
                steps: ['Scraping des prix régionaux...', 'Analyse de l\'offre et demande...', 'Calcul de la saisonnalité...', 'Estimation du prix optimal...'],
                finalResult: {
                    type: 'warning',
                    message: 'Alerte Marché : Hausse prévue du prix du manioc dans 2 semaines. Conseil : Attendez avant de récolter.',
                    data: 'Tendance : +12% / semaine'
                }
            }
        }
    ];

    const startSimulation = (model) => {
        setActiveSimulation(model);
        setSimulating(true);
        setProgress(0);
        setResult(null);

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 5;
            setProgress(currentProgress);
            if (currentProgress >= 100) {
                clearInterval(interval);
                setSimulating(false);
                setResult(model.simulation.finalResult);
            }
        }, 150);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-16 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 opacity-20">
                    <BrainCircuit className="h-96 w-96 text-agri-green animate-pulse" />
                </div>

                <div className="relative z-10 max-w-3xl space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-agri-green/20 border border-agri-green/30 px-4 py-2 rounded-full text-agri-green font-bold text-sm">
                        <Zap className="h-4 w-4" />
                        <span>Futur de l'Agriculture par BlackBenAI</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight">
                        L'Intelligence Artificielle au service de <span className="text-agri-green">votre terre.</span>
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed">
                        Nous développons la prochaine génération d'outils intelligents pour booster vos rendements,
                        protéger vos cultures et optimiser vos ventes. Découvrez nos modèles en cours de création.
                    </p>
                </div>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {aiModels.map((model) => (
                    <Card key={model.id} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-8">
                            <div className="space-y-4">
                                <div className={`p-4 rounded-2xl ${model.color} text-white shadow-lg inline-block`}>
                                    <model.icon className="h-8 w-8" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <CardTitle className="text-2xl font-bold">{model.name}</CardTitle>
                                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                            {model.status}
                                        </span>
                                    </div>
                                    <CardDescription className="text-agri-green font-bold mt-1">{model.tag}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <p className="text-gray-600 leading-relaxed">
                                {model.description}
                            </p>

                            {activeSimulation?.id === model.id && (
                                <div className="mt-8 p-6 bg-slate-50 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-4">
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                                        <span>{simulating ? model.simulation.title : 'Simulation terminée'}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2 bg-slate-200" />

                                    {simulating && (
                                        <div className="flex items-center text-xs text-slate-400 italic">
                                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                            {model.simulation.steps[Math.floor((progress / 100) * model.simulation.steps.length)]}
                                        </div>
                                    )}

                                    {result && (
                                        <div className={`p-4 rounded-2xl border-l-4 ${result.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
                                            result.type === 'warning' ? 'bg-orange-50 border-orange-500 text-orange-800' :
                                                'bg-blue-50 border-blue-500 text-blue-800'
                                            } animate-in zoom-in duration-300`}>
                                            <div className="flex items-start">
                                                {result.type === 'success' ? <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5" /> :
                                                    result.type === 'warning' ? <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" /> :
                                                        <Info className="h-5 w-5 mr-2 mt-0.5" />}
                                                <div>
                                                    <p className="font-bold text-sm">{result.message}</p>
                                                    <p className="text-xs opacity-70 mt-1">{result.data}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="px-8 pb-8 pt-0">
                            <Button
                                onClick={() => startSimulation(model)}
                                disabled={simulating}
                                className={`w-full py-6 rounded-2xl font-bold transition-all ${activeSimulation?.id === model.id && !simulating
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                            >
                                {simulating && activeSimulation?.id === model.id ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <Zap className="h-4 w-4 mr-2" />
                                        Simuler l'utilisation
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Vision Section */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-slate-100 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900">Pourquoi BlackBenAI ?</h2>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                            <div className="bg-green-100 p-2 rounded-lg text-agri-green">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <p className="text-slate-600"><strong>Adaptation Locale</strong> : Nos modèles sont entraînés sur des données spécifiques aux sols et climats africains.</p>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="bg-green-100 p-2 rounded-lg text-agri-green">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <p className="text-slate-600"><strong>Accessibilité</strong> : Une technologie de pointe accessible via un simple smartphone, même avec une faible connexion.</p>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="bg-green-100 p-2 rounded-lg text-agri-green">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <p className="text-slate-600"><strong>Impact Réel</strong> : Notre objectif est d'augmenter les revenus des agriculteurs de 40% d'ici 2027.</p>
                        </div>
                    </div>
                    <Button className="bg-agri-green hover:bg-agri-green/90 text-white px-8 py-6 rounded-2xl font-bold">
                        Devenir testeur Beta
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>
                <div className="relative">
                    <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-agri-green/20 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 animate-ping bg-agri-green rounded-full opacity-20"></div>
                                    <Camera className="h-16 w-16 text-white relative z-10" />
                                </div>
                                <p className="text-white font-bold tracking-widest uppercase text-xs">AgriVision Live Demo</p>
                            </div>
                        </div>
                        {/* Scanner line animation */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-agri-green/50 shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-scan"></div>
                    </div>
                    {/* Floating badges */}
                    <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-bounce">
                        <Bug className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-pulse">
                        <Sprout className="h-6 w-6 text-agri-green" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AILab;
