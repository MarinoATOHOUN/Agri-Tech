# © 2025 - Développé par Marino ATOHOUN (RinoGeek)
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
]
