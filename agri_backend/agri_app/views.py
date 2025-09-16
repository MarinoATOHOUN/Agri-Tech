# © 2025 - Développé par Marino ATOHOUN (RinoGeek)
"""
Vues API pour l'application de gestion agricole.

Ce fichier contient toutes les vues Django REST Framework
pour gérer les endpoints de l'API.
"""

from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db.models import Sum, Avg, Count, Q, F, Subquery, OuterRef, DecimalField
from django.db.models.functions import Coalesce
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal

from .models import Utilisateur, Culture, Recolte, Depense, ConseilAgricole
from .serializers import (
    UtilisateurSerializer, UtilisateurProfilSerializer, CultureSerializer,
    RecolteSerializer, DepenseSerializer, ConseilAgricoleSerializer,
    LoginSerializer, DashboardStatsSerializer, CultureDetailSerializer
)


class UtilisateurCreateView(generics.CreateAPIView):
    """
    Vue pour créer un nouvel utilisateur (inscription).
    """
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.AllowAny]


class UtilisateurProfilView(generics.RetrieveUpdateAPIView):
    """
    Vue pour récupérer et mettre à jour le profil de l'utilisateur connecté.
    """
    serializer_class = UtilisateurProfilSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """
    Vue pour l'authentification des utilisateurs.
    
    Retourne un token d'authentification en cas de succès.
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': UtilisateurProfilSerializer(user).data,
            'message': 'Connexion réussie'
        })
    
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """
    Vue pour la déconnexion des utilisateurs.
    
    Supprime le token d'authentification.
    """
    try:
        request.user.auth_token.delete()
        return Response({
            'message': 'Déconnexion réussie'
        })
    except:
        return Response({
            'message': 'Erreur lors de la déconnexion'
        }, status=status.HTTP_400_BAD_REQUEST)


class CultureListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des cultures.
    """
    serializer_class = CultureSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourne uniquement les cultures de l'utilisateur connecté."""
        queryset = Culture.objects.filter(utilisateur=self.request.user)
        
        # Filtres optionnels
        nom = self.request.query_params.get('nom', None)
        date_debut = self.request.query_params.get('date_debut', None)
        date_fin = self.request.query_params.get('date_fin', None)
        
        if nom:
            queryset = queryset.filter(nom__icontains=nom)
        
        if date_debut:
            queryset = queryset.filter(date_culture__gte=date_debut)
        
        if date_fin:
            queryset = queryset.filter(date_culture__lte=date_fin)
        
        return queryset
    
    def perform_create(self, serializer):
        """Associe automatiquement la culture à l'utilisateur connecté."""
        serializer.save(utilisateur=self.request.user)


class CultureDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour ou supprimer une culture spécifique.
    """
    serializer_class = CultureDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourne uniquement les cultures de l'utilisateur connecté."""
        return Culture.objects.filter(utilisateur=self.request.user)


class RecolteListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des récoltes.
    """
    serializer_class = RecolteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourne uniquement les récoltes des cultures de l'utilisateur connecté."""
        queryset = Recolte.objects.filter(culture__utilisateur=self.request.user)
        
        # Filtres optionnels
        culture_id = self.request.query_params.get('culture', None)
        date_debut = self.request.query_params.get('date_debut', None)
        date_fin = self.request.query_params.get('date_fin', None)
        
        if culture_id:
            queryset = queryset.filter(culture_id=culture_id)
        
        if date_debut:
            queryset = queryset.filter(date_recolte__gte=date_debut)
        
        if date_fin:
            queryset = queryset.filter(date_recolte__lte=date_fin)
        
        return queryset


class RecolteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour ou supprimer une récolte spécifique.
    """
    serializer_class = RecolteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourne uniquement les récoltes des cultures de l'utilisateur connecté."""
        return Recolte.objects.filter(culture__utilisateur=self.request.user)


class DepenseListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des dépenses.
    """
    serializer_class = DepenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourne uniquement les dépenses de l'utilisateur connecté."""
        queryset = Depense.objects.filter(utilisateur=self.request.user)
        
        # Filtres optionnels
        categorie = self.request.query_params.get('categorie', None)
        culture_id = self.request.query_params.get('culture', None)
        date_debut = self.request.query_params.get('date_debut', None)
        date_fin = self.request.query_params.get('date_fin', None)
        
        if categorie:
            queryset = queryset.filter(categorie=categorie)
        
        if culture_id:
            queryset = queryset.filter(culture_id=culture_id)
        
        if date_debut:
            queryset = queryset.filter(date_depense__gte=date_debut)
        
        if date_fin:
            queryset = queryset.filter(date_depense__lte=date_fin)
        
        return queryset
    
    def perform_create(self, serializer):
        """Associe automatiquement la dépense à l'utilisateur connecté."""
        serializer.save(utilisateur=self.request.user)


class DepenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour ou supprimer une dépense spécifique.
    """
    serializer_class = DepenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourne uniquement les dépenses de l'utilisateur connecté."""
        return Depense.objects.filter(utilisateur=self.request.user)


class ConseilAgricoleListView(generics.ListAPIView):
    """
    Vue pour lister les conseils agricoles de l'utilisateur.
    """
    serializer_class = ConseilAgricoleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourne uniquement les conseils de l'utilisateur connecté."""
        queryset = ConseilAgricole.objects.filter(utilisateur=self.request.user)
        
        # Filtres optionnels
        lu = self.request.query_params.get('lu', None)
        type_conseil = self.request.query_params.get('type', None)
        priorite = self.request.query_params.get('priorite', None)
        
        if lu is not None:
            queryset = queryset.filter(lu=lu.lower() == 'true')
        
        if type_conseil:
            queryset = queryset.filter(type_conseil=type_conseil)
        
        if priorite:
            queryset = queryset.filter(priorite=priorite)
        
        return queryset


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def marquer_conseil_lu(request, conseil_id):
    """
    Vue pour marquer un conseil comme lu.
    """
    try:
        conseil = ConseilAgricole.objects.get(
            id=conseil_id,
            utilisateur=request.user
        )
        conseil.lu = True
        conseil.save()
        
        return Response({
            'message': 'Conseil marqué comme lu'
        })
    except ConseilAgricole.DoesNotExist:
        return Response({
            'error': 'Conseil non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """
    Vue pour récupérer les statistiques du tableau de bord.
    """
    user = request.user
    
    # Statistiques de base
    total_cultures = Culture.objects.filter(utilisateur=user).count()
    total_recoltes = Recolte.objects.filter(culture__utilisateur=user).count()
    
    # Calculs financiers
    # CORRIGÉ : Le calcul des revenus totaux était incorrect.
    # Il multipliait la somme des quantités par la somme des prix.
    revenus_totaux = Recolte.objects.filter(
        culture__utilisateur=user
    ).aggregate(
        total=Sum(F('quantite_recoltee') * F('prix_vente_unitaire'))
    )['total'] or Decimal('0')
    
    # Dépenses totales (cultures + récoltes + dépenses générales)
    depenses_cultures = Culture.objects.filter(
        utilisateur=user
    ).aggregate(
        total=Sum('cout_achat_semences') + Sum('cout_main_oeuvre')
    )['total'] or Decimal('0')
    
    depenses_recoltes = Recolte.objects.filter(
        culture__utilisateur=user
    ).aggregate(
        total=Sum('depenses_liees_recolte')
    )['total'] or Decimal('0')
    
    depenses_generales = Depense.objects.filter(
        utilisateur=user
    ).aggregate(
        total=Sum('montant')
    )['total'] or Decimal('0')
    
    depenses_totales = depenses_cultures + depenses_recoltes + depenses_generales
    benefice_net = revenus_totaux - depenses_totales
    
    # Culture la plus rentable (optimisé pour éviter les N+1 queries)
    revenues_subquery = Recolte.objects.filter(
        culture=OuterRef('pk')
    ).values('culture').annotate(
        total=Sum(F('quantite_recoltee') * F('prix_vente_unitaire'))
    ).values('total')

    expenses_subquery = Depense.objects.filter(
        culture=OuterRef('pk')
    ).values('culture').annotate(
        total=Sum('montant')
    ).values('total')

    cultures_rentabilite = Culture.objects.filter(
        utilisateur=user
    ).annotate(
        total_revenus=Coalesce(Subquery(revenues_subquery, output_field=DecimalField()), Decimal('0.0')),
        total_depenses_associees=Coalesce(Subquery(expenses_subquery, output_field=DecimalField()), Decimal('0.0'))
    ).annotate(
        benefice_net_culture=F('total_revenus') - (F('cout_achat_semences') + F('cout_main_oeuvre') + F('total_depenses_associees'))
    )

    culture_plus_rentable_obj = cultures_rentabilite.filter(total_revenus__gt=0).order_by('-benefice_net_culture').first()

    culture_plus_rentable = "Aucune"
    if culture_plus_rentable_obj:
        culture_plus_rentable = culture_plus_rentable_obj.nom
    
    # Rendement moyen
    # CORRIGÉ : Le calcul du "rendement moyen" calculait en réalité la "superficie moyenne".
    # Le calcul correct est la moyenne du rendement (quantité récoltée / superficie) pour chaque culture.
    cultures_avec_rendement = Culture.objects.filter(
        utilisateur=user,
        superficie__gt=0,
        recoltes__isnull=False
    ).annotate(
        total_recolte=Sum('recoltes__quantite_recoltee')
    ).aggregate(
        moyenne=Avg(F('total_recolte') / F('superficie'))
    )['moyenne'] or Decimal('0')
    
    rendement_moyen = round(cultures_avec_rendement, 2)
    # Conseils non lus
    conseils_non_lus = ConseilAgricole.objects.filter(
        utilisateur=user,
        lu=False
    ).count()
    
    stats = {
        'total_cultures': total_cultures,
        'total_recoltes': total_recoltes,
        'revenus_totaux': revenus_totaux,
        'depenses_totales': depenses_totales,
        'benefice_net': benefice_net,
        'culture_plus_rentable': culture_plus_rentable,
        'rendement_moyen': rendement_moyen,
        'conseils_non_lus': conseils_non_lus,
    }
    
    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def graphiques_donnees(request):
    """
    Vue pour récupérer les données des graphiques.
    """
    user = request.user
    
    # Données pour le graphique des revenus par mois (12 derniers mois)
    revenus_par_mois = []
    depenses_par_mois = []
    
    for i in range(12):
        date_debut = timezone.now().replace(day=1) - timedelta(days=30*i)
        date_fin = (date_debut + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        # CORRIGÉ : Le calcul des revenus mensuels était incorrect.
        revenus_mois = Recolte.objects.filter(
            culture__utilisateur=user,
            date_recolte__range=[date_debut, date_fin]
        ).aggregate(
            # Le calcul correct est la somme du produit (quantité * prix) pour chaque récolte
            total=Sum(F('quantite_recoltee') * F('prix_vente_unitaire'))
        )['total'] or 0
        
        depenses_mois = Depense.objects.filter(
            utilisateur=user,
            date_depense__range=[date_debut, date_fin]
        ).aggregate(
            total=Sum('montant')
        )['total'] or 0
        
        revenus_par_mois.insert(0, {
            'mois': date_debut.strftime('%Y-%m'),
            'revenus': float(revenus_mois)
        })
        
        depenses_par_mois.insert(0, {
            'mois': date_debut.strftime('%Y-%m'),
            'depenses': float(depenses_mois)
        })
    
    # Données pour le graphique des cultures par rendement
    cultures_rendement_query = Culture.objects.filter(
        utilisateur=user,
        superficie__gt=0
    ).annotate(
        total_recolte=Coalesce(Sum('recoltes__quantite_recoltee'), Decimal('0.0'))
    ).annotate(
        rendement=F('total_recolte') / F('superficie')
    ).values('nom', 'rendement', 'superficie')
    
    cultures_rendement = [
        {
            'nom': c['nom'],
            'rendement': float(c['rendement'] or 0),
            'superficie': float(c['superficie'])
        } for c in cultures_rendement_query
    ]

    # Données pour le graphique des dépenses par catégorie
    depenses_par_categorie = Depense.objects.filter(
        utilisateur=user
    ).values('categorie').annotate(
        total=Sum('montant')
    ).order_by('-total')
    
    depenses_categories = [
        {
            'categorie': item['categorie'],
            'total': float(item['total'])
        }
        for item in depenses_par_categorie
    ]
    
    return Response({
        'revenus_par_mois': revenus_par_mois,
        'depenses_par_mois': depenses_par_mois,
        'cultures_rendement': cultures_rendement,
        'depenses_par_categorie': depenses_categories
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def cultures_options(request):
    """
    Vue pour récupérer la liste des cultures de l'utilisateur (pour les selects).
    """
    cultures = Culture.objects.filter(
        utilisateur=request.user
    ).values('id', 'nom', 'date_culture')
    
    return Response(list(cultures))
