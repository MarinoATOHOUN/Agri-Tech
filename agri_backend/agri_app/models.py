# © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
"""
Modèles de données pour l'application de gestion agricole.

Ce fichier contient tous les modèles Django nécessaires pour gérer
les données agricoles : utilisateurs, cultures, récoltes et dépenses.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Utilisateur(AbstractUser):
    """
    Modèle d'utilisateur personnalisé pour les agriculteurs.
    
    Étend le modèle User de Django pour inclure des informations
    spécifiques aux agriculteurs africains.
    """
    
    TYPE_AGRICULTURE_CHOICES = [
        ('vivriere', 'Agriculture vivrière'),
        ('commerciale', 'Agriculture commerciale'),
        ('mixte', 'Agriculture mixte'),
    ]
    
    type_agriculture = models.CharField(
        max_length=20,
        choices=TYPE_AGRICULTURE_CHOICES,
        default='vivriere',
        verbose_name="Type d'agriculture",
        help_text="Type d'agriculture pratiquée par l'agriculteur"
    )
    
    zone_geographique = models.CharField(
        max_length=200,
        verbose_name="Zone géographique",
        help_text="Localisation géographique de l'exploitation agricole"
    )
    
    telephone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name="Numéro de téléphone",
        help_text="Numéro de téléphone pour les notifications SMS"
    )
    
    PLAN_ABONNEMENT_CHOICES = [
        ('gratuit', 'Gratuit'),
        ('pro', 'Professionnel'),
        ('expert', 'Expert / Coopérative'),
    ]

    plan_abonnement = models.CharField(
        max_length=20,
        choices=PLAN_ABONNEMENT_CHOICES,
        default='gratuit',
        verbose_name="Plan d'abonnement"
    )

    photo_profil = models.ImageField(
        upload_to='profils/',
        null=True,
        blank=True,
        verbose_name="Photo de profil"
    )

    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création du compte"
    )
    
    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"


class Culture(models.Model):
    """
    Modèle représentant une culture agricole.
    
    Contient toutes les informations relatives à une culture :
    semences, coûts, dates, localisation, etc.
    """
    
    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name='cultures',
        verbose_name="Agriculteur"
    )
    
    nom = models.CharField(
        max_length=100,
        verbose_name="Nom de la culture",
        help_text="Ex: Maïs, Riz, Tomate, etc."
    )
    
    date_culture = models.DateField(
        verbose_name="Date de plantation/semis",
        help_text="Date à laquelle la culture a été plantée"
    )
    
    quantite_semee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name="Quantité semée",
        help_text="Quantité de semences utilisées (en kg ou unité appropriée)"
    )
    
    unite_semence = models.CharField(
        max_length=20,
        default='kg',
        verbose_name="Unité de mesure des semences",
        help_text="Ex: kg, sacs, litres, etc."
    )
    
    cout_achat_semences = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name="Coût d'achat des semences",
        help_text="Montant total dépensé pour l'achat des semences (en FCFA)"
    )
    
    cout_main_oeuvre = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name="Coût de la main d'œuvre",
        help_text="Montant total dépensé pour la main d'œuvre (en FCFA)"
    )
    
    zone_geographique = models.CharField(
        max_length=200,
        verbose_name="Zone géographique",
        help_text="Localisation précise de cette culture"
    )
    
    superficie = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name="Superficie cultivée",
        help_text="Superficie en hectares"
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Notes additionnelles",
        help_text="Observations, conseils, ou informations supplémentaires"
    )
    
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'enregistrement"
    )
    
    date_modification = models.DateTimeField(
        auto_now=True,
        verbose_name="Dernière modification"
    )
    
    class Meta:
        verbose_name = "Culture"
        verbose_name_plural = "Cultures"
        ordering = ['-date_culture']
    
    def __str__(self):
        return f"{self.nom} - {self.date_culture} ({self.utilisateur.username})"
    
    @property
    def cout_total_initial(self):
        """Calcule le coût total initial de la culture."""
        achat = self.cout_achat_semences or 0
        main_oeuvre = self.cout_main_oeuvre or 0
        return achat + main_oeuvre
    
    @property
    def rendement_par_hectare(self):
        """Calcule le rendement par hectare si des récoltes existent."""
        total_recolte = sum(r.quantite_recoltee or Decimal('0.00') for r in self.recoltes.all())
        if self.superficie and self.superficie > 0:
            return total_recolte / self.superficie
        return 0


class Recolte(models.Model):
    """
    Modèle représentant une récolte d'une culture.
    
    Une culture peut avoir plusieurs récoltes (récoltes échelonnées).
    """
    
    culture = models.ForeignKey(
        Culture,
        on_delete=models.CASCADE,
        related_name='recoltes',
        verbose_name="Culture associée"
    )
    
    date_recolte = models.DateField(
        verbose_name="Date de récolte",
        help_text="Date à laquelle la récolte a été effectuée"
    )
    
    quantite_recoltee = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name="Quantité récoltée",
        help_text="Quantité totale récoltée"
    )
    
    unite_recolte = models.CharField(
        max_length=20,
        default='kg',
        verbose_name="Unité de mesure de la récolte",
        help_text="Ex: kg, sacs, tonnes, etc."
    )
    
    prix_vente_unitaire = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name="Prix de vente unitaire",
        help_text="Prix de vente par unité (en FCFA)"
    )
    
    depenses_liees_recolte = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        default=Decimal('0.00'),
        verbose_name="Dépenses liées à la récolte",
        help_text="Coûts de récolte, transport, stockage, etc. (en FCFA)"
    )
    
    qualite_recolte = models.CharField(
        max_length=20,
        choices=[
            ('excellente', 'Excellente'),
            ('bonne', 'Bonne'),
            ('moyenne', 'Moyenne'),
            ('faible', 'Faible'),
        ],
        default='bonne',
        verbose_name="Qualité de la récolte"
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Notes sur la récolte",
        help_text="Observations sur la qualité, les conditions, etc."
    )
    
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'enregistrement"
    )
    
    class Meta:
        verbose_name = "Récolte"
        verbose_name_plural = "Récoltes"
        ordering = ['-date_recolte']
    
    def __str__(self):
        return f"Récolte de {self.culture.nom} - {self.date_recolte}"
    
    @property
    def revenus_totaux(self):
        """Calcule les revenus totaux de cette récolte."""
        quantite = self.quantite_recoltee or Decimal('0.00')
        prix = self.prix_vente_unitaire or Decimal('0.00')
        return quantite * prix
    
    @property
    def benefice_net(self):
        """Calcule le bénéfice net de cette récolte."""
        depenses = self.depenses_liees_recolte or Decimal('0.00')
        return self.revenus_totaux - depenses


class Depense(models.Model):
    """
    Modèle pour les dépenses générales non liées directement à une récolte.
    
    Permet de tracker toutes les dépenses agricoles : engrais, pesticides,
    équipements, carburant, etc.
    """
    
    CATEGORIE_CHOICES = [
        ('semences', 'Semences'),
        ('engrais', 'Engrais et amendements'),
        ('pesticides', 'Pesticides et herbicides'),
        ('equipement', 'Équipements et outils'),
        ('carburant', 'Carburant et énergie'),
        ('transport', 'Transport'),
        ('main_oeuvre', 'Main d\'œuvre supplémentaire'),
        ('irrigation', 'Irrigation'),
        ('stockage', 'Stockage et conservation'),
        ('autre', 'Autre'),
    ]
    
    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name='depenses',
        verbose_name="Agriculteur"
    )
    
    culture = models.ForeignKey(
        Culture,
        on_delete=models.CASCADE,
        related_name='depenses',
        blank=True,
        null=True,
        verbose_name="Culture associée",
        help_text="Culture à laquelle cette dépense est liée (optionnel)"
    )
    
    description = models.CharField(
        max_length=200,
        verbose_name="Description de la dépense",
        help_text="Description détaillée de la dépense"
    )
    
    categorie = models.CharField(
        max_length=20,
        choices=CATEGORIE_CHOICES,
        default='autre',
        verbose_name="Catégorie de dépense"
    )
    
    montant = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name="Montant de la dépense",
        help_text="Montant en FCFA"
    )
    
    date_depense = models.DateField(
        verbose_name="Date de la dépense",
        help_text="Date à laquelle la dépense a été effectuée"
    )
    
    fournisseur = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Fournisseur",
        help_text="Nom du fournisseur ou du prestataire"
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Notes additionnelles"
    )
    
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'enregistrement"
    )
    
    class Meta:
        verbose_name = "Dépense"
        verbose_name_plural = "Dépenses"
        ordering = ['-date_depense']
    
    def __str__(self):
        return f"{self.description} - {self.montant} FCFA ({self.date_depense})"


class ConseilAgricole(models.Model):
    """
    Modèle pour stocker les conseils agricoles personnalisés.
    
    Permet de fournir des recommandations basées sur les performances
    et les données de l'agriculteur.
    """
    
    TYPE_CONSEIL_CHOICES = [
        ('culture', 'Conseil de culture'),
        ('rendement', 'Amélioration du rendement'),
        ('economique', 'Conseil économique'),
        ('technique', 'Conseil technique'),
        ('saisonnier', 'Conseil saisonnier'),
    ]
    
    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name='conseils',
        verbose_name="Agriculteur"
    )
    
    titre = models.CharField(
        max_length=200,
        verbose_name="Titre du conseil"
    )
    
    contenu = models.TextField(
        verbose_name="Contenu du conseil",
        help_text="Conseil détaillé et personnalisé"
    )
    
    type_conseil = models.CharField(
        max_length=20,
        choices=TYPE_CONSEIL_CHOICES,
        default='technique',
        verbose_name="Type de conseil"
    )
    
    priorite = models.CharField(
        max_length=10,
        choices=[
            ('basse', 'Basse'),
            ('moyenne', 'Moyenne'),
            ('haute', 'Haute'),
            ('urgente', 'Urgente'),
        ],
        default='moyenne',
        verbose_name="Priorité"
    )
    
    lu = models.BooleanField(
        default=False,
        verbose_name="Lu par l'utilisateur"
    )
    
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )
    
    date_expiration = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Date d'expiration",
        help_text="Date après laquelle le conseil n'est plus pertinent"
    )
    
    class Meta:
        verbose_name = "Conseil agricole"
        verbose_name_plural = "Conseils agricoles"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"{self.titre} ({self.get_type_conseil_display()})"


class Conversation(models.Model):
    """
    Regroupe une série d'échanges entre l'utilisateur et l'IA.
    """
    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name='conversations',
        verbose_name="Utilisateur"
    )
    
    titre = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Titre de la conversation"
    )
    
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de début"
    )
    
    date_mise_a_jour = models.DateTimeField(
        auto_now=True,
        verbose_name="Dernière activité"
    )
    
    class Meta:
        ordering = ['-date_mise_a_jour']
        verbose_name = "Conversation IA"
        verbose_name_plural = "Conversations IA"
    
    def __str__(self):
        return f"{self.titre or 'Nouvelle conversation'} ({self.date_creation.strftime('%d/%m/%Y')})"


class MessageChat(models.Model):
    """
    Un message individuel dans une conversation (User ou IA).
    """
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name="Conversation"
    )
    
    est_utilisateur = models.BooleanField(
        default=True,
        verbose_name="Est l'utilisateur ?",
        help_text="Vrai si le message vient de l'utilisateur, Faux si c'est l'IA"
    )
    
    contenu = models.TextField(
        verbose_name="Contenu du message"
    )
    
    date_envoi = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'envoi"
    )
    
    contexte_donnees = models.JSONField(
        null=True,
        blank=True,
        verbose_name="Données contextuelles",
        help_text="Snapshot des données utilisées pour générer la réponse (si IA)"
    )
    
    class Meta:
        ordering = ['date_envoi']
        verbose_name = "Message Chat"
        verbose_name_plural = "Messages Chat"
    
    def __str__(self):
        sender = "User" if self.est_utilisateur else "IA"
        return f"{sender}: {self.contenu[:50]}..."


class RapportIA(models.Model):
    """
    Modèle pour stocker les rapports d'analyse complets générés par l'IA.
    """
    
    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name='rapports_ia',
        verbose_name="Agriculteur"
    )
    
    titre = models.CharField(
        max_length=255,
        verbose_name="Titre du rapport"
    )
    
    # Stockage des données structurées pour les graphiques
    donnees_graphiques = models.JSONField(
        default=dict,
        verbose_name="Données pour les graphiques",
        help_text="Données structurées (JSON) pour générer des graphiques sur le frontend"
    )
    
    analyse_complete = models.TextField(
        verbose_name="Analyse complète",
        help_text="Texte détaillé de l'analyse générée par l'IA"
    )
    
    propositions_amelioration = models.TextField(
        verbose_name="Propositions d'amélioration",
        help_text="Liste des suggestions pour améliorer l'exploitation"
    )
    
    points_progression = models.TextField(
        verbose_name="Points de progression",
        help_text="Analyse de l'évolution par rapport aux rapports précédents"
    )
    
    pdf_file = models.FileField(
        upload_to='rapports_pdf/',
        null=True,
        blank=True,
        verbose_name="Fichier PDF"
    )
    
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de génération"
    )
    
    class Meta:
        verbose_name = "Rapport IA"
        verbose_name_plural = "Rapports IA"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"Rapport du {self.date_creation.strftime('%d/%m/%Y')} - {self.utilisateur.username}"


class UserLocation(models.Model):
    """
    Modèle pour stocker l'historique de localisation de l'utilisateur.
    """
    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name='locations',
        verbose_name="Utilisateur"
    )
    
    ip_address = models.GenericIPAddressField(
        verbose_name="Adresse IP"
    )
    
    latitude = models.FloatField(
        null=True, 
        blank=True,
        verbose_name="Latitude"
    )
    
    longitude = models.FloatField(
        null=True, 
        blank=True,
        verbose_name="Longitude"
    )
    
    city = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name="Ville"
    )
    
    country = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name="Pays"
    )
    
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date et heure"
    )
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Localisation Utilisateur"
        verbose_name_plural = "Localisations Utilisateurs"
        indexes = [
            models.Index(fields=['utilisateur', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.utilisateur.username} - {self.city}, {self.country} ({self.timestamp})"


class SupportMessage(models.Model):
    """
    Modèle pour les messages de support et propositions des utilisateurs.
    """
    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name='messages_support',
        verbose_name="Utilisateur"
    )
    sujet = models.CharField(max_length=200, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    date_envoi = models.DateTimeField(auto_now_add=True, verbose_name="Date d'envoi")
    traite = models.BooleanField(default=False, verbose_name="Traité")

    class Meta:
        verbose_name = "Message de Support"
        verbose_name_plural = "Messages de Support"
        ordering = ['-date_envoi']

    def __str__(self):
        return f"{self.sujet} - {self.utilisateur.username}"


class ProduitAnnonce(models.Model):
    """
    Modèle pour les annonces de produits agricoles sur la marketplace.
    """
    CATEGORIE_CHOICES = [
        ('cereales', 'Céréales'),
        ('tubercules', 'Tubercules'),
        ('fruits', 'Fruits'),
        ('legumes', 'Légumes'),
        ('elevage', 'Élevage'),
        ('intrants', 'Semences & Intrants'),
        ('materiel', 'Matériel Agricole'),
        ('autre', 'Autre'),
    ]

    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name='annonces',
        verbose_name="Vendeur"
    )
    nom = models.CharField(max_length=200, verbose_name="Nom du produit")
    description = models.TextField(verbose_name="Description détaillée")
    prix = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Prix")
    unite = models.CharField(max_length=50, verbose_name="Unité (ex: kg, sac, tonne)")
    quantite_disponible = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Quantité disponible")
    categorie = models.CharField(max_length=50, choices=CATEGORIE_CHOICES, verbose_name="Catégorie")
    localisation = models.CharField(max_length=255, verbose_name="Localisation du produit")
    image = models.ImageField(upload_to='annonces/', null=True, blank=True, verbose_name="Image du produit")
    
    # Contact
    telephone_contact = models.CharField(max_length=20, verbose_name="Téléphone de contact")
    email_contact = models.EmailField(verbose_name="Email de contact")
    lien_externe = models.URLField(blank=True, null=True, verbose_name="Lien externe (ex: site web, WhatsApp)")

    # Statut
    est_publie = models.BooleanField(default=False, verbose_name="Est publié")
    paiement_effectue = models.BooleanField(default=False, verbose_name="Paiement frais de mise en rayon effectué")
    date_creation = models.DateTimeField(auto_now_add=True)
    date_expiration = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Annonce Produit"
        verbose_name_plural = "Annonces Produits"
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.nom} - {self.prix} FCFA"
class NewsletterSubscription(models.Model):
    """
    Modèle pour stocker les inscriptions à la newsletter.
    """
    email = models.EmailField(unique=True)
    date_inscription = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Inscription Newsletter"
        verbose_name_plural = "Inscriptions Newsletter"

    def __str__(self):
        return self.email

class ContactMessage(models.Model):
    """
    Modèle pour stocker les messages du formulaire de contact public.
    """
    nom = models.CharField(max_length=200, verbose_name="Nom complet")
    email = models.EmailField(verbose_name="Email")
    sujet = models.CharField(max_length=200, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    date_envoi = models.DateTimeField(auto_now_add=True, verbose_name="Date d'envoi")
    traite = models.BooleanField(default=False, verbose_name="Traité")

    class Meta:
        verbose_name = "Message de Contact"
        verbose_name_plural = "Messages de Contact"
        ordering = ['-date_envoi']

    def __str__(self):
        return f"{self.nom} - {self.sujet}"

