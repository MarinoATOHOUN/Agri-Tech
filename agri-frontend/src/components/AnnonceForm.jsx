// © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
/**
 * Formulaire détaillé pour ajouter un produit à la marketplace.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Upload,
    Store,
    Info,
    DollarSign,
    MapPin,
    Phone,
    Mail,
    Link as LinkIcon,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { annonceService } from '../services/api';

const AnnonceForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: '',
        unite: 'kg',
        quantite_disponible: '',
        categorie: 'cereales',
        localisation: '',
        telephone_contact: '',
        email_contact: '',
        lien_externe: '',
        image: null
    });

    const categories = [
        { id: 'cereales', label: 'Céréales' },
        { id: 'tubercules', label: 'Tubercules' },
        { id: 'fruits', label: 'Fruits' },
        { id: 'legumes', label: 'Légumes' },
        { id: 'elevage', label: 'Élevage' },
        { id: 'intrants', label: 'Semences & Intrants' },
        { id: 'materiel', label: 'Matériel Agricole' },
        { id: 'autre', label: 'Autre' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });

            await annonceService.create(data);
            setSuccess(true);
            setTimeout(() => navigate('/marketplace?view=mine'), 2000);
        } catch (err) {
            console.error('Erreur lors de la création de l\'annonce:', err);
            alert('Une erreur est survenue. Vérifiez tous les champs.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in zoom-in">
                <div className="bg-green-100 p-6 rounded-full">
                    <CheckCircle2 className="h-20 w-20 text-green-600" />
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Annonce créée avec succès !</h2>
                    <p className="text-gray-600 mt-2">Redirection vers la marketplace pour le paiement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="hover:bg-white"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour au marché
            </Button>

            <div className="flex items-center space-x-4">
                <div className="p-3 bg-agri-brown rounded-2xl shadow-lg shadow-orange-100">
                    <Store className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mettre en rayon</h1>
                    <p className="text-gray-600">Remplissez les détails pour rendre votre produit irrésistible.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Image Upload */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-xl shadow-gray-100 overflow-hidden">
                            <CardHeader className="bg-gray-50/50">
                                <CardTitle className="text-sm flex items-center">
                                    <Upload className="h-4 w-4 mr-2 text-agri-brown" />
                                    Image du produit
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div
                                    className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden hover:border-agri-brown transition-colors cursor-pointer group"
                                    onClick={() => document.getElementById('image-upload').click()}
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-sm font-bold">Changer l'image</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            <div className="bg-gray-50 p-4 rounded-full inline-block mb-3">
                                                <Upload className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-600">Cliquez pour ajouter une photo</p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 5MB</p>
                                        </div>
                                    )}
                                    <input
                                        id="image-upload"
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-blue-50 p-6 rounded-3xl space-y-3">
                            <div className="flex items-center text-blue-700 font-bold">
                                <Info className="h-5 w-5 mr-2" />
                                Conseil vendeur
                            </div>
                            <p className="text-sm text-blue-600 leading-relaxed">
                                Une belle photo augmente vos chances de vente de 80%. Prenez votre produit sous une bonne lumière naturelle.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Form Fields */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-none shadow-xl shadow-gray-100">
                            <CardHeader>
                                <CardTitle className="text-xl">Informations générales</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Nom du produit</label>
                                    <Input
                                        name="nom"
                                        placeholder="Ex: Maïs Jaune Séché, Tomates Bio..."
                                        value={formData.nom}
                                        onChange={handleChange}
                                        required
                                        className="rounded-xl border-gray-200"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Catégorie</label>
                                        <select
                                            name="categorie"
                                            value={formData.categorie}
                                            onChange={handleChange}
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-agri-green/20 focus:border-agri-green transition-all appearance-none cursor-pointer"
                                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Localisation</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                name="localisation"
                                                placeholder="Ville, Région"
                                                value={formData.localisation}
                                                onChange={handleChange}
                                                required
                                                className="pl-10 rounded-xl border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Description détaillée</label>
                                    <Textarea
                                        name="description"
                                        placeholder="Décrivez la qualité, la variété, les conditions de culture..."
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        className="rounded-xl border-gray-200"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl shadow-gray-100">
                            <CardHeader>
                                <CardTitle className="text-xl">Prix et Quantité</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Prix (FCFA)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            name="prix"
                                            type="number"
                                            placeholder="0"
                                            value={formData.prix}
                                            onChange={handleChange}
                                            required
                                            className="pl-10 rounded-xl border-gray-200"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Unité</label>
                                    <Input
                                        name="unite"
                                        placeholder="kg, sac, tonne..."
                                        value={formData.unite}
                                        onChange={handleChange}
                                        required
                                        className="rounded-xl border-gray-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Quantité dispo.</label>
                                    <Input
                                        name="quantite_disponible"
                                        type="number"
                                        placeholder="0"
                                        value={formData.quantite_disponible}
                                        onChange={handleChange}
                                        required
                                        className="rounded-xl border-gray-200"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl shadow-gray-100">
                            <CardHeader>
                                <CardTitle className="text-xl">Contact & Liens</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Téléphone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                name="telephone_contact"
                                                placeholder="+229 ..."
                                                value={formData.telephone_contact}
                                                onChange={handleChange}
                                                required
                                                className="pl-10 rounded-xl border-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                name="email_contact"
                                                type="email"
                                                placeholder="contact@..."
                                                value={formData.email_contact}
                                                onChange={handleChange}
                                                required
                                                className="pl-10 rounded-xl border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Lien externe / WhatsApp (Optionnel)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            name="lien_externe"
                                            placeholder="https://wa.me/..."
                                            value={formData.lien_externe}
                                            onChange={handleChange}
                                            className="pl-10 rounded-xl border-gray-200"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-agri-green hover:bg-agri-green/90 text-white font-bold py-8 rounded-2xl shadow-xl shadow-green-100 transition-all transform hover:scale-[1.01]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                        Création en cours...
                                    </>
                                ) : (
                                    "Enregistrer et passer au paiement (1000 FCFA)"
                                )}
                            </Button>
                            <p className="text-center text-xs text-gray-400 mt-4">
                                En publiant, vous acceptez nos conditions de vente. Les frais de mise en rayon sont non remboursables.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AnnonceForm;
