// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
/**
 * Composant Marketplace pour afficher les annonces de produits agricoles.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ShoppingBag,
    Search,
    Filter,
    Plus,
    MapPin,
    Tag,
    Phone,
    Mail,
    ExternalLink,
    Loader2,
    Image as ImageIcon,
    CheckCircle2,
    AlertCircle,
    User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { annonceService, utils } from '../services/api';

const Marketplace = () => {
    const location = useLocation();
    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('tous');
    const [showMyAds, setShowMyAds] = useState(false);
    const [unpaidCount, setUnpaidCount] = useState(0);

    const categories = [
        { id: 'tous', label: 'Tous les produits' },
        { id: 'cereales', label: 'Céréales' },
        { id: 'tubercules', label: 'Tubercules' },
        { id: 'fruits', label: 'Fruits' },
        { id: 'legumes', label: 'Légumes' },
        { id: 'elevage', label: 'Élevage' },
        { id: 'intrants', label: 'Intrants' },
        { id: 'materiel', label: 'Matériel' },
    ];

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('view') === 'mine') {
            setShowMyAds(true);
        }
    }, [location]);

    useEffect(() => {
        loadAnnonces();
        checkUnpaidAds();
    }, [activeCategory, showMyAds]);

    const loadAnnonces = async () => {
        try {
            setLoading(true);
            let data;
            if (showMyAds) {
                data = await annonceService.getMine();
            } else {
                const filters = activeCategory !== 'tous' ? { categorie: activeCategory } : {};
                data = await annonceService.getAll(filters);
            }
            setAnnonces(data.results || data);
        } catch (err) {
            console.error('Erreur lors du chargement des annonces:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkUnpaidAds = async () => {
        try {
            const data = await annonceService.getMine();
            const mine = data.results || data;
            const unpaid = mine.filter(a => !a.paiement_effectue).length;
            setUnpaidCount(unpaid);
        } catch (err) {
            console.error('Erreur lors de la vérification des annonces non payées:', err);
        }
    };

    const handlePayAndPublish = async (id) => {
        try {
            await annonceService.payAndPublish(id);
            loadAnnonces();
        } catch (err) {
            alert('Erreur lors du paiement. Veuillez réessayer.');
        }
    };

    const filteredAnnonces = annonces.filter(annonce =>
        annonce.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        annonce.localisation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-agri-green rounded-2xl shadow-lg shadow-green-100">
                        <ShoppingBag className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Marketplace Agricole</h1>
                        <p className="text-gray-600">Trouvez des produits frais ou vendez votre récolte.</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <Button
                        variant={showMyAds ? "default" : "outline"}
                        onClick={() => setShowMyAds(!showMyAds)}
                        className={`relative ${showMyAds ? "bg-agri-green hover:bg-agri-green/90" : ""}`}
                    >
                        {showMyAds ? "Voir tout le marché" : "Mes annonces"}
                        {!showMyAds && unpaidCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center text-white font-bold">
                                    {unpaidCount}
                                </span>
                            </span>
                        )}
                    </Button>
                    <Link to="/marketplace/vendre">
                        <Button className="bg-agri-brown hover:bg-agri-brown/90 text-white shadow-lg shadow-orange-100">
                            <Plus className="h-5 w-5 mr-2" />
                            Mettre en rayon
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search and Categories */}
            <div className="space-y-6">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        placeholder="Rechercher un produit, une ville..."
                        className="pl-12 py-7 rounded-2xl border-none shadow-xl shadow-gray-100 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
                                ? 'bg-agri-green text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid of Ads */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-agri-green" />
                </div>
            ) : filteredAnnonces.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <ImageIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">Aucune annonce trouvée</h3>
                    <p className="text-gray-500 mt-2">Soyez le premier à proposer ce produit sur le marché !</p>
                    <Link to="/marketplace/vendre" className="mt-6 inline-block">
                        <Button variant="outline">Mettre un produit en vente</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAnnonces.map((annonce) => (
                        <Card key={annonce.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
                            <div className="relative h-52 overflow-hidden">
                                {annonce.image ? (
                                    <img
                                        src={annonce.image}
                                        alt={annonce.nom}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-agri-green shadow-sm">
                                        {categories.find(c => c.id === annonce.categorie)?.label}
                                    </span>
                                </div>
                                {showMyAds && (
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${annonce.est_publie ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                            }`}>
                                            {annonce.est_publie ? 'En ligne' : 'Brouillon'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <CardContent className="p-5 flex-grow space-y-3">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="h-6 w-6 rounded-full bg-agri-green/10 flex items-center justify-center overflow-hidden">
                                        {annonce.vendeur_photo ? (
                                            <img 
                                                src={annonce.vendeur_photo} 
                                                alt={annonce.vendeur_nom} 
                                                className="h-full w-full object-cover" 
                                            />
                                        ) : (
                                            <User className="h-3 w-3 text-agri-green" />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-500">{annonce.vendeur_nom}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{annonce.nom}</h3>
                                    <p className="text-agri-green font-black text-lg">
                                        {utils.formatCurrency(annonce.prix)}
                                        <span className="text-xs text-gray-400 font-normal ml-1">/{annonce.unite}</span>
                                    </p>
                                </div>

                                <p className="text-gray-500 text-sm line-clamp-2 h-10">
                                    {annonce.description}
                                </p>

                                <div className="flex items-center text-gray-400 text-xs space-x-4 pt-2">
                                    <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {annonce.localisation}
                                    </div>
                                    <div className="flex items-center">
                                        <Tag className="h-3 w-3 mr-1" />
                                        {annonce.quantite_disponible} {annonce.unite} dispo.
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-5 pt-0">
                                {showMyAds && !annonce.paiement_effectue ? (
                                    <Button
                                        onClick={() => handlePayAndPublish(annonce.id)}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
                                    >
                                        Payer les frais (1000 FCFA)
                                    </Button>
                                ) : (
                                    <div className="w-full space-y-2">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-agri-green text-agri-green hover:bg-green-50"
                                                onClick={() => window.location.href = `tel:${annonce.telephone_contact}`}
                                            >
                                                <Phone className="h-4 w-4 mr-2" />
                                                Appeler
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                                                onClick={() => window.location.href = `mailto:${annonce.email_contact}`}
                                            >
                                                <Mail className="h-4 w-4 mr-2" />
                                                Email
                                            </Button>
                                        </div>
                                        {annonce.lien_externe && (
                                            <Button
                                                variant="ghost"
                                                className="w-full text-xs text-gray-400 hover:text-agri-green"
                                                onClick={() => window.open(annonce.lien_externe, '_blank')}
                                            >
                                                <ExternalLink className="h-3 w-3 mr-2" />
                                                Plus d'infos / WhatsApp
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Seller Info Banner */}
            <div className="bg-gradient-to-r from-agri-green to-emerald-700 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-2xl font-bold">Vendez vos produits plus rapidement</h2>
                        <p className="text-green-50 opacity-90">
                            Mettez en rayon vos récoltes et touchez des milliers d'acheteurs potentiels.
                        </p>
                    </div>
                    <Link to="/marketplace/vendre">
                        <Button className="bg-white text-agri-green hover:bg-green-50 font-bold px-8 py-6 rounded-2xl text-lg">
                            Commencer à vendre
                        </Button>
                    </Link>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-10">
                    <ShoppingBag className="h-64 w-64" />
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
