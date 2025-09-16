# © 2025 - Développé par Marino ATOHOUN (RinoGeek)
"""
Configuration de l'interface d'administration Django.

Ce fichier configure l'affichage et la gestion des modèles
dans l'interface d'administration Django.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Utilisateur, Culture, Recolte, Depense, ConseilAgricole


@admin.register(Utilisateur)
class UtilisateurAdmin(UserAdmin):
    """
    Configuration de l'administration pour le modèle Utilisateur.
    """
    
    list_display = [
        'username', 'email', 'first_name', 'last_name',
        'type_agriculture', 'zone_geographique', 'date_creation'
    ]
    
    list_filter = [
        'type_agriculture', 'is_active', 'is_staff', 'date_creation'
    ]
    
    search_fields = [
        'username', 'email', 'first_name', 'last_name', 'zone_geographique'
    ]
    
    fieldsets = UserAdmin.fieldsets + (
        ('Informations agricoles', {
            'fields': ('type_agriculture', 'zone_geographique', 'telephone')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informations agricoles', {
            'fields': ('type_agriculture', 'zone_geographique', 'telephone')
        }),
    )


@admin.register(Culture)
class CultureAdmin(admin.ModelAdmin):
    """
    Configuration de l'administration pour le modèle Culture.
    """
    
    list_display = [
        'nom', 'utilisateur', 'date_culture', 'superficie',
        'cout_total_initial', 'zone_geographique', 'date_creation'
    ]
    
    list_filter = [
        'nom', 'date_culture', 'zone_geographique', 'date_creation'
    ]
    
    search_fields = [
        'nom', 'utilisateur__username', 'zone_geographique'
    ]
    
    date_hierarchy = 'date_culture'
    
    readonly_fields = ['cout_total_initial', 'date_creation', 'date_modification']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('utilisateur', 'nom', 'date_culture', 'zone_geographique')
        }),
        ('Détails de la culture', {
            'fields': ('quantite_semee', 'unite_semence', 'superficie')
        }),
        ('Coûts', {
            'fields': ('cout_achat_semences', 'cout_main_oeuvre', 'cout_total_initial')
        }),
        ('Notes et dates', {
            'fields': ('notes', 'date_creation', 'date_modification')
        }),
    )


@admin.register(Recolte)
class RecolteAdmin(admin.ModelAdmin):
    """
    Configuration de l'administration pour le modèle Recolte.
    """
    
    list_display = [
        'culture', 'date_recolte', 'quantite_recoltee',
        'prix_vente_unitaire', 'revenus_totaux', 'benefice_net',
        'qualite_recolte'
    ]
    
    list_filter = [
        'qualite_recolte', 'date_recolte', 'culture__nom'
    ]
    
    search_fields = [
        'culture__nom', 'culture__utilisateur__username'
    ]
    
    date_hierarchy = 'date_recolte'
    
    readonly_fields = ['revenus_totaux', 'benefice_net', 'date_creation']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('culture', 'date_recolte', 'qualite_recolte')
        }),
        ('Quantités et prix', {
            'fields': ('quantite_recoltee', 'unite_recolte', 'prix_vente_unitaire')
        }),
        ('Calculs financiers', {
            'fields': ('depenses_liees_recolte', 'revenus_totaux', 'benefice_net')
        }),
        ('Notes et dates', {
            'fields': ('notes', 'date_creation')
        }),
    )


@admin.register(Depense)
class DepenseAdmin(admin.ModelAdmin):
    """
    Configuration de l'administration pour le modèle Depense.
    """
    
    list_display = [
        'description', 'utilisateur', 'categorie', 'montant',
        'date_depense', 'culture', 'fournisseur'
    ]
    
    list_filter = [
        'categorie', 'date_depense', 'culture__nom'
    ]
    
    search_fields = [
        'description', 'utilisateur__username', 'fournisseur'
    ]
    
    date_hierarchy = 'date_depense'
    
    readonly_fields = ['date_creation']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('utilisateur', 'description', 'categorie', 'date_depense')
        }),
        ('Détails financiers', {
            'fields': ('montant', 'fournisseur')
        }),
        ('Association', {
            'fields': ('culture',)
        }),
        ('Notes et dates', {
            'fields': ('notes', 'date_creation')
        }),
    )


@admin.register(ConseilAgricole)
class ConseilAgricoleAdmin(admin.ModelAdmin):
    """
    Configuration de l'administration pour le modèle ConseilAgricole.
    """
    
    list_display = [
        'titre', 'utilisateur', 'type_conseil', 'priorite',
        'lu', 'date_creation', 'date_expiration'
    ]
    
    list_filter = [
        'type_conseil', 'priorite', 'lu', 'date_creation'
    ]
    
    search_fields = [
        'titre', 'contenu', 'utilisateur__username'
    ]
    
    date_hierarchy = 'date_creation'
    
    readonly_fields = ['date_creation']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('utilisateur', 'titre', 'type_conseil', 'priorite')
        }),
        ('Contenu', {
            'fields': ('contenu',)
        }),
        ('État et dates', {
            'fields': ('lu', 'date_creation', 'date_expiration')
        }),
    )
    
    actions = ['marquer_comme_lu', 'marquer_comme_non_lu']
    
    def marquer_comme_lu(self, request, queryset):
        """Action pour marquer les conseils sélectionnés comme lus."""
        updated = queryset.update(lu=True)
        self.message_user(
            request,
            f'{updated} conseil(s) marqué(s) comme lu(s).'
        )
    marquer_comme_lu.short_description = "Marquer comme lu"
    
    def marquer_comme_non_lu(self, request, queryset):
        """Action pour marquer les conseils sélectionnés comme non lus."""
        updated = queryset.update(lu=False)
        self.message_user(
            request,
            f'{updated} conseil(s) marqué(s) comme non lu(s).'
        )
    marquer_comme_non_lu.short_description = "Marquer comme non lu"


# Personnalisation du site d'administration
admin.site.site_header = "Administration - Gestion Agricole"
admin.site.site_title = "Gestion Agricole Admin"
admin.site.index_title = "Tableau de bord administrateur"
