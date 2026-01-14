# © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
"""
Configuration de l'interface d'administration Django.

Ce fichier configure l'affichage et la gestion des modèles
dans l'interface d'administration Django.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.db.models import Sum, F
from .models import Utilisateur, Culture, Recolte, Depense, ConseilAgricole, RapportIA, Conversation, MessageChat, UserLocation


# --- INLINES ---

class CultureInline(admin.TabularInline):
    model = Culture
    extra = 0
    fields = ('nom', 'date_culture', 'superficie', 'cout_total_initial')
    readonly_fields = ('cout_total_initial',)
    show_change_link = True

class RecolteInline(admin.TabularInline):
    model = Recolte
    extra = 0
    fields = ('date_recolte', 'quantite_recoltee', 'unite_recolte', 'revenus_totaux', 'benefice_net')
    readonly_fields = ('revenus_totaux', 'benefice_net')
    show_change_link = True

class DepenseInline(admin.TabularInline):
    model = Depense
    extra = 0
    fields = ('description', 'categorie', 'montant', 'date_depense')
    show_change_link = True

class RapportIAInline(admin.TabularInline):
    model = RapportIA
    extra = 0
    fields = ('titre', 'date_creation', 'download_link')
    readonly_fields = ('date_creation', 'download_link')
    show_change_link = True
    
    def download_link(self, obj):
        if obj.pdf_file:
            return format_html('<a href="{}" target="_blank">Télécharger PDF</a>', obj.pdf_file.url)
        return "-"
    download_link.short_description = "PDF"


# --- ADMINS ---

@admin.register(Utilisateur)
class UtilisateurAdmin(UserAdmin):
    """
    Configuration de l'administration pour le modèle Utilisateur.
    """
    list_display = [
        'username', 'email', 'first_name', 'last_name',
        'type_agriculture', 'zone_geographique', 'cultures_count', 'date_creation'
    ]
    
    list_filter = [
        'type_agriculture', 'is_active', 'is_staff', 'date_creation', 'zone_geographique'
    ]
    
    search_fields = [
        'username', 'email', 'first_name', 'last_name', 'zone_geographique', 'telephone'
    ]
    
    fieldsets = UserAdmin.fieldsets + (
        ('Informations agricoles', {
            'fields': ('type_agriculture', 'zone_geographique', 'telephone')
        }),
    )
    
    inlines = [CultureInline, RapportIAInline]
    
    def cultures_count(self, obj):
        return obj.cultures.count()
    cultures_count.short_description = "Nb Cultures"


@admin.register(Culture)
class CultureAdmin(admin.ModelAdmin):
    """
    Configuration de l'administration pour le modèle Culture.
    """
    list_display = [
        'nom', 'utilisateur', 'date_culture', 'superficie',
        'total_recoltes', 'total_depenses', 'rentabilite', 'zone_geographique'
    ]
    
    list_filter = [
        'nom', 'date_culture', 'zone_geographique', 'date_creation'
    ]
    
    search_fields = [
        'nom', 'utilisateur__username', 'utilisateur__first_name', 'utilisateur__last_name'
    ]
    
    date_hierarchy = 'date_culture'
    
    readonly_fields = ['cout_total_initial', 'date_creation', 'date_modification', 'total_recoltes', 'total_depenses']
    
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
        ('Bilan Financier (Calculé)', {
            'fields': ('total_recoltes', 'total_depenses')
        }),
        ('Notes et dates', {
            'fields': ('notes', 'date_creation', 'date_modification')
        }),
    )
    
    inlines = [RecolteInline, DepenseInline]
    
    def total_recoltes(self, obj):
        total = obj.recoltes.aggregate(
            total_rev=Sum(F('quantite_recoltee') * F('prix_vente_unitaire'))
        )['total_rev'] or 0
        return f"{total:,.0f} FCFA"
    total_recoltes.short_description = "Revenus Totaux"
    
    def total_depenses(self, obj):
        # Coût initial + dépenses liées
        depenses_directes = obj.depenses.aggregate(Sum('montant'))['montant__sum'] or 0
        total = obj.cout_total_initial + depenses_directes
        return f"{total:,.0f} FCFA"
    total_depenses.short_description = "Dépenses Totales"
    
    def rentabilite(self, obj):
        rev = obj.recoltes.aggregate(
            total_rev=Sum(F('quantite_recoltee') * F('prix_vente_unitaire'))
        )['total_rev'] or 0
        
        dep_directes = obj.depenses.aggregate(Sum('montant'))['montant__sum'] or 0
        dep = dep_directes + obj.cout_total_initial
        
        profit = rev - dep
        color = 'green' if profit >= 0 else 'red'
        profit_fmt = f"{profit:,.0f} FCFA"
        return format_html('<span style="color: {}; font-weight: bold;">{}</span>', color, profit_fmt)
    rentabilite.short_description = "Rentabilité"


@admin.register(Recolte)
class RecolteAdmin(admin.ModelAdmin):
    """
    Configuration de l'administration pour le modèle Recolte.
    """
    list_display = [
        'culture', 'date_recolte', 'quantite_recoltee_fmt',
        'prix_vente_unitaire_fmt', 'revenus_totaux_fmt', 'benefice_net_fmt',
        'qualite_badge'
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
    
    def quantite_recoltee_fmt(self, obj):
        return f"{obj.quantite_recoltee} {obj.unite_recolte}"
    quantite_recoltee_fmt.short_description = "Quantité"
    
    def prix_vente_unitaire_fmt(self, obj):
        return f"{obj.prix_vente_unitaire:,.0f} FCFA"
    prix_vente_unitaire_fmt.short_description = "Prix Unitaire"
    
    def revenus_totaux_fmt(self, obj):
        return f"{obj.revenus_totaux:,.0f} FCFA"
    revenus_totaux_fmt.short_description = "Revenus"
    
    def benefice_net_fmt(self, obj):
        color = 'green' if obj.benefice_net >= 0 else 'red'
        valeur_fmt = f"{obj.benefice_net:,.0f} FCFA"
        return format_html('<span style="color: {};">{}</span>', color, valeur_fmt)
    benefice_net_fmt.short_description = "Bénéfice Net"
    
    def qualite_badge(self, obj):
        colors = {
            'excellente': 'green',
            'bonne': 'blue',
            'moyenne': 'orange',
            'mauvaise': 'red'
        }
        color = colors.get(obj.qualite_recolte, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 10px;">{}</span>',
            color, obj.get_qualite_recolte_display()
        )
    qualite_badge.short_description = "Qualité"


@admin.register(Depense)
class DepenseAdmin(admin.ModelAdmin):
    """
    Configuration de l'administration pour le modèle Depense.
    """
    list_display = [
        'description', 'utilisateur', 'categorie_badge', 'montant_fmt',
        'date_depense', 'culture_link'
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
    
    def montant_fmt(self, obj):
        return f"{obj.montant:,.0f} FCFA"
    montant_fmt.short_description = "Montant"
    
    def categorie_badge(self, obj):
        return format_html(
            '<span style="background-color: #6c757d; color: white; padding: 3px 10px; border-radius: 10px;">{}</span>',
            obj.get_categorie_display()
        )
    categorie_badge.short_description = "Catégorie"
    
    def culture_link(self, obj):
        if obj.culture:
            return format_html('<a href="/admin/agri_app/culture/{}/change/">{}</a>', obj.culture.id, obj.culture.nom)
        return "-"
    culture_link.short_description = "Culture"


@admin.register(ConseilAgricole)
class ConseilAgricoleAdmin(admin.ModelAdmin):
    """
    Configuration de l'administration pour le modèle ConseilAgricole.
    """
    list_display = [
        'titre', 'utilisateur', 'type_badge', 'priorite_badge',
        'lu_icon', 'date_creation'
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
    
    def type_badge(self, obj):
        return format_html(
            '<span style="background-color: #17a2b8; color: white; padding: 3px 10px; border-radius: 10px;">{}</span>',
            obj.get_type_conseil_display()
        )
    type_badge.short_description = "Type"
    
    def priorite_badge(self, obj):
        colors = {
            'haute': 'red',
            'moyenne': 'orange',
            'basse': 'green'
        }
        color = colors.get(obj.priorite, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.get_priorite_display()
        )
    priorite_badge.short_description = "Priorité"
    
    def lu_icon(self, obj):
        return "✅" if obj.lu else "❌"
    lu_icon.short_description = "Lu"
    
    def marquer_comme_lu(self, request, queryset):
        updated = queryset.update(lu=True)
        self.message_user(request, f'{updated} conseil(s) marqué(s) comme lu(s).')
    marquer_comme_lu.short_description = "Marquer comme lu"
    
    def marquer_comme_non_lu(self, request, queryset):
        updated = queryset.update(lu=False)
        self.message_user(request, f'{updated} conseil(s) marqué(s) comme non lu(s).')
    marquer_comme_non_lu.short_description = "Marquer comme non lu"


@admin.register(RapportIA)
class RapportIAAdmin(admin.ModelAdmin):
    """
    Configuration de l'administration pour le modèle RapportIA.
    """
    list_display = [
        'titre', 'utilisateur', 'date_creation', 'download_link'
    ]
    
    list_filter = [
        'date_creation', 'utilisateur__username'
    ]
    
    search_fields = [
        'titre', 'utilisateur__username', 'analyse_complete'
    ]
    
    date_hierarchy = 'date_creation'
    
    readonly_fields = ['date_creation', 'download_link']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('utilisateur', 'titre', 'date_creation')
        }),
        ('Fichiers', {
            'fields': ('pdf_file', 'download_link')
        }),
        ('Contenu généré', {
            'fields': ('analyse_complete', 'propositions_amelioration', 'points_progression'),
            'classes': ('collapse',)
        }),
        ('Données brutes', {
            'fields': ('donnees_graphiques',),
            'classes': ('collapse',)
        }),
    )
    
    def download_link(self, obj):
        if obj.pdf_file:
            return format_html('<a href="{}" target="_blank" class="button">Télécharger PDF</a>', obj.pdf_file.url)
        return "-"
    download_link.short_description = "PDF"


class MessageChatInline(admin.TabularInline):
    model = MessageChat
    extra = 0
    readonly_fields = ['date_envoi', 'est_utilisateur']
    fields = ['est_utilisateur', 'contenu', 'date_envoi']
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['titre', 'utilisateur', 'date_creation', 'date_mise_a_jour', 'nb_messages']
    list_filter = ['date_creation', 'utilisateur']
    search_fields = ['titre', 'utilisateur__username']
    inlines = [MessageChatInline]
    readonly_fields = ['date_creation', 'date_mise_a_jour']
    
    def nb_messages(self, obj):
        return obj.messages.count()
    nb_messages.short_description = "Messages"


@admin.register(MessageChat)
class MessageChatAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'expediteur', 'apercu_contenu', 'date_envoi']
    list_filter = ['est_utilisateur', 'date_envoi', 'conversation__utilisateur']
    search_fields = ['contenu', 'conversation__titre']
    readonly_fields = ['date_envoi', 'contexte_donnees']
    
    def expediteur(self, obj):
        return "Utilisateur" if obj.est_utilisateur else "IA"
    expediteur.short_description = "Expéditeur"
    
    def apercu_contenu(self, obj):
        return obj.contenu[:50] + "..." if len(obj.contenu) > 50 else obj.contenu
    apercu_contenu.short_description = "Contenu"


@admin.register(UserLocation)
class UserLocationAdmin(admin.ModelAdmin):
    list_display = ['utilisateur', 'city', 'country', 'ip_address', 'timestamp']
    list_filter = ['country', 'city', 'timestamp', 'utilisateur']
    search_fields = ['utilisateur__username', 'city', 'country', 'ip_address']
    readonly_fields = ['timestamp', 'ip_address', 'latitude', 'longitude', 'city', 'country']
    
    def has_add_permission(self, request):
        return False
