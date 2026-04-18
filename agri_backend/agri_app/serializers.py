# © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
"""
Serializers pour l'API REST de l'application de gestion agricole.

Ce fichier contient tous les serializers Django REST Framework
pour convertir les modèles en JSON et vice versa.
"""

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Utilisateur, Culture, Recolte, Depense, ConseilAgricole, RapportIA, Conversation, MessageChat, SupportMessage, ProduitAnnonce, NewsletterSubscription, ContactMessage


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
            'date_creation', 'date_joined', 'last_login', 'plan_abonnement', 'password', 'password_confirm'
        ]
        extra_kwargs = {
            'username': {'required': False, 'allow_blank': True},
            'email': {'required': True, 'allow_blank': False},
            'password': {'write_only': True},
            'date_creation': {'read_only': True},
        }

    def validate_email(self, value):
        """Valide que l'email est unique (insensible à la casse)."""
        if not value:
            raise serializers.ValidationError("L'email est requis.")

        normalized = value.strip().lower()
        queryset = Utilisateur.objects.filter(email__iexact=normalized)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("Un compte avec cet email existe déjà.")

        return normalized
    
    def validate(self, attrs):
        """Valide que les mots de passe correspondent."""
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs
    
    def create(self, validated_data):
        """Crée un nouvel utilisateur avec un mot de passe haché."""
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        username = (validated_data.get('username') or '').strip()
        email = (validated_data.get('email') or '').strip().lower()
        validated_data['email'] = email

        # Si le frontend ne fournit pas de username, on l'aligne sur l'email
        # afin de permettre l'authentification Django via username en interne.
        if not username:
            validated_data['username'] = email
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
            'date_creation', 'date_joined', 'last_login', 'plan_abonnement', 'photo_profil'
        ]
        read_only_fields = ['id', 'username', 'date_creation', 'date_joined', 'last_login']


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
    
    # Compatibilité : accepter encore "username" pendant la transition,
    # mais l'UI doit utiliser "email".
    email = serializers.EmailField(required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField()
    
    def validate(self, attrs):
        """Valide les informations de connexion."""
        email = attrs.get('email')
        username = attrs.get('username')
        password = attrs.get('password')
        
        if email and password:
            email = email.strip().lower()
            matching_users = Utilisateur.objects.filter(email__iexact=email)
            if not matching_users.exists():
                raise serializers.ValidationError('Email ou mot de passe incorrect.')
            if matching_users.count() > 1:
                raise serializers.ValidationError(
                    "Plusieurs comptes utilisent cet email. Veuillez contacter le support."
                )

            user_obj = matching_users.first()
            user = authenticate(username=user_obj.username, password=password)
            if not user:
                raise serializers.ValidationError('Email ou mot de passe incorrect.')
            if not user.is_active:
                raise serializers.ValidationError('Ce compte utilisateur est désactivé.')

            attrs['user'] = user
            return attrs
        elif username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Email ou mot de passe incorrect.')
            if not user.is_active:
                raise serializers.ValidationError('Ce compte utilisateur est désactivé.')

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                'L\'email et le mot de passe sont requis.'
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


class RapportIASerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle RapportIA.
    """
    
    class Meta:
        model = RapportIA
        fields = [
            'id', 'utilisateur', 'titre', 'donnees_graphiques',
            'analyse_complete', 'propositions_amelioration',
            'points_progression', 'pdf_file', 'date_creation'
        ]
        read_only_fields = ['id', 'date_creation', 'pdf_file']


class MessageChatSerializer(serializers.ModelSerializer):
    """
    Serializer pour les messages du chat.
    """
    class Meta:
        model = MessageChat
        fields = ['id', 'est_utilisateur', 'contenu', 'date_envoi', 'contexte_donnees']
        read_only_fields = ['date_envoi']


class ConversationSerializer(serializers.ModelSerializer):
    """
    Serializer pour les conversations.
    """
    messages = MessageChatSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['id', 'titre', 'date_creation', 'date_mise_a_jour', 'messages']
        read_only_fields = ['date_creation', 'date_mise_a_jour']


class SupportMessageSerializer(serializers.ModelSerializer):
    """
    Serializer pour les messages de support.
    """
    class Meta:
        model = SupportMessage
        fields = ['id', 'utilisateur', 'sujet', 'message', 'date_envoi', 'traite']
        read_only_fields = ['id', 'utilisateur', 'date_envoi', 'traite']


class ProduitAnnonceSerializer(serializers.ModelSerializer):
    """
    Serializer pour les annonces de produits.
    """
    vendeur_nom = serializers.ReadOnlyField(source='utilisateur.get_full_name')
    vendeur_photo = serializers.ImageField(source='utilisateur.photo_profil', read_only=True)
    
    class Meta:
        model = ProduitAnnonce
        fields = [
            'id', 'utilisateur', 'vendeur_nom', 'vendeur_photo', 'nom', 'description', 'prix', 
            'unite', 'quantite_disponible', 'categorie', 'localisation', 
            'image', 'telephone_contact', 'email_contact', 'lien_externe', 
            'est_publie', 'paiement_effectue', 'date_creation'
        ]
        read_only_fields = ['id', 'utilisateur', 'est_publie', 'paiement_effectue', 'date_creation']

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer pour le changement de mot de passe.
    """
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Les mots de passe ne correspondent pas."})
        return attrs

class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    """
    Serializer pour les inscriptions à la newsletter.
    """
    class Meta:
        model = NewsletterSubscription
        fields = ['id', 'email', 'date_inscription']

class ContactMessageSerializer(serializers.ModelSerializer):
    """
    Serializer pour les messages de contact.
    """
    class Meta:
        model = ContactMessage
        fields = ['id', 'nom', 'email', 'sujet', 'message', 'date_envoi']
