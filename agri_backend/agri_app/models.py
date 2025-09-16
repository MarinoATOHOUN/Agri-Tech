# © 2025 - Développé par Marino ATOHOUN (RinoGeek)
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
        return self.cout_achat_semences + self.cout_main_oeuvre
    
    @property
    def rendement_par_hectare(self):
        """Calcule le rendement par hectare si des récoltes existent."""
        total_recolte = sum(r.quantite_recoltee for r in self.recoltes.all())
        if self.superficie > 0:
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
        return self.quantite_recoltee * self.prix_vente_unitaire
    
    @property
    def benefice_net(self):
        """Calcule le bénéfice net de cette récolte."""
        return self.revenus_totaux - self.depenses_liees_recolte


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
        related_name='depenses_associees',
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
        return f"{self.titre} - {self.utilisateur.username}"