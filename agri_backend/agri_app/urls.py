# © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
"""
Configuration des URLs pour l'application de gestion agricole.

Ce fichier définit tous les endpoints de l'API REST.
"""

from django.urls import path
from . import views

urlpatterns = [
    # Authentification
    path('auth/register/', views.UtilisateurCreateView.as_view(), name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/profile/', views.UtilisateurProfilView.as_view(), name='profile'),
    
    # Cultures
    path('cultures/', views.CultureListCreateView.as_view(), name='culture-list-create'),
    path('cultures/<int:pk>/', views.CultureDetailView.as_view(), name='culture-detail'),
    path('cultures/options/', views.cultures_options, name='cultures-options'),
    
    # Récoltes
    path('recoltes/', views.RecolteListCreateView.as_view(), name='recolte-list-create'),
    path('recoltes/<int:pk>/', views.RecolteDetailView.as_view(), name='recolte-detail'),
    
    # Dépenses
    path('depenses/', views.DepenseListCreateView.as_view(), name='depense-list-create'),
    path('depenses/<int:pk>/', views.DepenseDetailView.as_view(), name='depense-detail'),
    
    # Conseils agricoles
    path('conseils/', views.ConseilAgricoleListView.as_view(), name='conseil-list'),
    path('conseils/<int:conseil_id>/marquer-lu/', views.marquer_conseil_lu, name='marquer-conseil-lu'),
    
    # Tableau de bord et statistiques
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
    path('dashboard/graphiques/', views.graphiques_donnees, name='graphiques-donnees'),
    
    # Chatbot AI et Conversations
    path('chatbot/', views.chatbot_view, name='chatbot'),
    path('conversations/', views.ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:id>/', views.ConversationDetailView.as_view(), name='conversation-detail'),
    
    # Rapports IA
    path('rapports/', views.RapportIAListView.as_view(), name='rapport-list'),
    path('rapports/generer/', views.generate_rapport_view, name='generer-rapport'),
    
    # Support
    path('support/', views.SupportMessageListCreateView.as_view(), name='support-list-create'),
    
    # Marketplace (Annonces)
    path('annonces/', views.ProduitAnnonceListView.as_view(), name='annonce-list'),
    path('annonces/creer/', views.ProduitAnnonceCreateView.as_view(), name='annonce-create'),
    path('annonces/mes-annonces/', views.MesAnnoncesListView.as_view(), name='mes-annonces'),
    path('annonces/<int:pk>/', views.ProduitAnnonceDetailView.as_view(), name='annonce-detail'),
    path('annonces/<int:pk>/payer/', views.simuler_paiement_annonce, name='annonce-payer'),
]
