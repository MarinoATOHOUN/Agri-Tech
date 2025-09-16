# © 2025 - Développé par Marino ATOHOUN (RinoGeek)
"""
Serializers pour l'API REST de l'application de gestion agricole.

Ce fichier contient tous les serializers Django REST Framework
pour convertir les modèles en JSON et vice versa.
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Utilisateur, Culture, Recolte, Depense, ConseilAgricole


class UtilisateurSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Utilisateur.
    
    Gère la sérialisation des données utilisateur pour l'API,
    en excluant les informations sensibles comme le mot de passe.
    """
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Utilisateur
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'type_agriculture', 'zone_geographique', 'telephone',
            'date_creation', 'password', 'password_confirm'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'date_creation': {'read_only': True},
        }
    
    def validate(self, attrs):
        """Valide que les mots de passe correspondent."""
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs
    
    def create(self, validated_data):
        """Crée un nouvel utilisateur avec un mot de passe haché."""
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        user = Utilisateur.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        """Met à jour un utilisateur existant."""
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class UtilisateurProfilSerializer(serializers.ModelSerializer):
    """
    Serializer simplifié pour le profil utilisateur (sans mot de passe).
    """
    
    class Meta:
        model = Utilisateur
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'type_agriculture', 'zone_geographique', 'telephone',
            'date_creation'
        ]
        read_only_fields = ['id', 'username', 'date_creation']


class CultureSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Culture.
    
    Inclut des champs calculés pour le coût total et le rendement.
    """
    
    utilisateur = serializers.StringRelatedField(read_only=True)
    cout_total_initial = serializers.ReadOnlyField()
    rendement_par_hectare = serializers.ReadOnlyField()
    nombre_recoltes = serializers.SerializerMethodField()
    revenus_totaux = serializers.SerializerMethodField()
    
    class Meta:
        model = Culture
        fields = [
            'id', 'utilisateur', 'nom', 'date_culture', 'quantite_semee',
            'unite_semence', 'cout_achat_semences', 'cout_main_oeuvre',
            'zone_geographique', 'superficie', 'notes', 'date_creation',
            'date_modification', 'cout_total_initial', 'rendement_par_hectare',
            'nombre_recoltes', 'revenus_totaux'
        ]
        read_only_fields = ['id', 'date_creation', 'date_modification']
    
    def get_nombre_recoltes(self, obj):
        """Retourne le nombre de récoltes pour cette culture."""
        return obj.recoltes.count()
    
    def get_revenus_totaux(self, obj):
        """Calcule les revenus totaux de toutes les récoltes de cette culture."""
        return sum(recolte.revenus_totaux for recolte in obj.recoltes.all())


class RecolteSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Recolte.
    
    Inclut des champs calculés pour les revenus et bénéfices.
    """
    
    culture_nom = serializers.CharField(source='culture.nom', read_only=True)
    revenus_totaux = serializers.ReadOnlyField()
    benefice_net = serializers.ReadOnlyField()
    
    class Meta:
        model = Recolte
        fields = [
            'id', 'culture', 'culture_nom', 'date_recolte', 'quantite_recoltee',
            'unite_recolte', 'prix_vente_unitaire', 'depenses_liees_recolte',
            'qualite_recolte', 'notes', 'date_creation', 'revenus_totaux',
            'benefice_net'
        ]
        read_only_fields = ['id', 'date_creation']
    
    def validate_culture(self, value):
        """Valide que la culture appartient à l'utilisateur connecté."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if value.utilisateur != request.user:
                raise serializers.ValidationError(
                    "Vous ne pouvez créer une récolte que pour vos propres cultures."
                )
        return value


class DepenseSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Depense.
    """
    
    utilisateur = serializers.StringRelatedField(read_only=True)
    culture_nom = serializers.CharField(source='culture.nom', read_only=True)
    
    class Meta:
        model = Depense
        fields = [
            'id', 'utilisateur', 'culture', 'culture_nom', 'description',
            'categorie', 'montant', 'date_depense', 'fournisseur', 'notes',
            'date_creation'
        ]
        read_only_fields = ['id', 'date_creation']
    
    def validate_culture(self, value):
        """Valide que la culture appartient à l'utilisateur connecté."""
        if value:  # La culture est optionnelle
            request = self.context.get('request')
            if request and hasattr(request, 'user'):
                if value.utilisateur != request.user:
                    raise serializers.ValidationError(
                        "Vous ne pouvez associer une dépense qu'à vos propres cultures."
                    )
        return value


class ConseilAgricoleSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle ConseilAgricole.
    """
    
    utilisateur = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = ConseilAgricole
        fields = [
            'id', 'utilisateur', 'titre', 'contenu', 'type_conseil',
            'priorite', 'lu', 'date_creation', 'date_expiration'
        ]
        read_only_fields = ['id', 'date_creation']


class LoginSerializer(serializers.Serializer):
    """
    Serializer pour l'authentification des utilisateurs.
    """
    
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        """Valide les informations de connexion."""
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError(
                    'Nom d\'utilisateur ou mot de passe incorrect.'
                )
            if not user.is_active:
                raise serializers.ValidationError(
                    'Ce compte utilisateur est désactivé.'
                )
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                'Le nom d\'utilisateur et le mot de passe sont requis.'
            )


class DashboardStatsSerializer(serializers.Serializer):
    """
    Serializer pour les statistiques du tableau de bord.
    """
    
    total_cultures = serializers.IntegerField()
    total_recoltes = serializers.IntegerField()
    revenus_totaux = serializers.DecimalField(max_digits=15, decimal_places=2)
    depenses_totales = serializers.DecimalField(max_digits=15, decimal_places=2)
    benefice_net = serializers.DecimalField(max_digits=15, decimal_places=2)
    culture_plus_rentable = serializers.CharField()
    rendement_moyen = serializers.DecimalField(max_digits=10, decimal_places=2)
    conseils_non_lus = serializers.IntegerField()


class CultureDetailSerializer(CultureSerializer):
    """
    Serializer détaillé pour une culture avec ses récoltes et dépenses.
    """
    
    recoltes = RecolteSerializer(many=True, read_only=True)
    depenses_associees = DepenseSerializer(many=True, read_only=True)
    
    class Meta(CultureSerializer.Meta):
        fields = CultureSerializer.Meta.fields + ['recoltes', 'depenses_associees']
