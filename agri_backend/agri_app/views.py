# © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
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
from django.contrib.auth.models import update_last_login
from django.db.models import Sum, Avg, Count, Q, F, Subquery, OuterRef, DecimalField, Case, When
from django.db.models.functions import Coalesce
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal

from .models import Utilisateur, Culture, Recolte, Depense, ConseilAgricole, RapportIA, Conversation, MessageChat, SupportMessage, ProduitAnnonce
from .serializers import (
    UtilisateurSerializer, UtilisateurProfilSerializer, CultureSerializer,
    RecolteSerializer, DepenseSerializer, ConseilAgricoleSerializer,
    LoginSerializer, DashboardStatsSerializer, CultureDetailSerializer,
    RapportIASerializer, ConversationSerializer, MessageChatSerializer, SupportMessageSerializer, ProduitAnnonceSerializer
)
from .ai_service import GeminiService
from .utils import generate_report_pdf


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
        update_last_login(None, user)
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
    Vue pour récupérer les données des graphiques avec des analyses avancées.
    """
    user = request.user
    
    # 1. Évolution mensuelle (Revenus vs Dépenses)
    evolution_mensuelle = []
    tendance_cumulative = []
    cumul_benefice = Decimal('0')
    
    # On récupère les 12 derniers mois
    for i in range(11, -1, -1):
        date_debut = (timezone.now().replace(day=1) - timedelta(days=30*i)).replace(day=1)
        if date_debut.month == 12:
            date_fin = date_debut.replace(year=date_debut.year + 1, month=1) - timedelta(days=1)
        else:
            date_fin = date_debut.replace(month=date_debut.month + 1) - timedelta(days=1)
        
        revenus_mois = Recolte.objects.filter(
            culture__utilisateur=user,
            date_recolte__range=[date_debut, date_fin]
        ).aggregate(
            total=Sum(F('quantite_recoltee') * F('prix_vente_unitaire'))
        )['total'] or Decimal('0')
        
        depenses_mois = Depense.objects.filter(
            utilisateur=user,
            date_depense__range=[date_debut, date_fin]
        ).aggregate(
            total=Sum('montant')
        )['total'] or Decimal('0')
        
        # Ajouter les coûts initiaux des cultures plantées ce mois-là
        depenses_initiales = Culture.objects.filter(
            utilisateur=user,
            date_culture__range=[date_debut, date_fin]
        ).aggregate(
            total=Sum('cout_achat_semences') + Sum('cout_main_oeuvre')
        )['total'] or Decimal('0')
        
        total_depenses_mois = depenses_mois + depenses_initiales
        benefice_mois = revenus_mois - total_depenses_mois
        cumul_benefice += benefice_mois
        
        mois_label = date_debut.strftime('%b %Y')
        
        evolution_mensuelle.append({
            'mois': mois_label, 
            'revenus': float(revenus_mois),
            'depenses': float(total_depenses_mois)
        })
        tendance_cumulative.append({'mois': mois_label, 'benefice_cumule': float(cumul_benefice)})

    # 2. Performance par culture
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

    recolte_quantite_subquery = Recolte.objects.filter(
        culture=OuterRef('pk')
    ).values('culture').annotate(
        total=Sum('quantite_recoltee')
    ).values('total')

    cultures_stats = Culture.objects.filter(
        utilisateur=user
    ).annotate(
        total_revenus=Coalesce(Subquery(revenues_subquery, output_field=DecimalField()), Decimal('0.0')),
        total_depenses_associees=Coalesce(Subquery(expenses_subquery, output_field=DecimalField()), Decimal('0.0')),
        total_recolte=Coalesce(Subquery(recolte_quantite_subquery, output_field=DecimalField()), Decimal('0.0'))
    ).annotate(
        total_depenses=F('cout_achat_semences') + F('cout_main_oeuvre') + F('total_depenses_associees'),
        rendement=Case(
            When(superficie__gt=0, then=F('total_recolte') / F('superficie')),
            default=Decimal('0.0'),
            output_field=DecimalField()
        )
    )

    rendement_par_culture = [
        {'nom': c.nom, 'rendement': float(c.rendement)} 
        for c in cultures_stats if c.rendement > 0
    ]

    benefice_par_culture = [
        {'nom': c.nom, 'benefice': float(c.total_revenus - c.total_depenses)} 
        for c in cultures_stats
    ]

    # 3. Dépenses par catégorie
    depenses_par_categorie_query = Depense.objects.filter(
        utilisateur=user
    ).values('categorie').annotate(
        total=Sum('montant')
    ).order_by('-total')
    
    depenses_par_categorie = [
        {'categorie': item['categorie'], 'total': float(item['total'])}
        for item in depenses_par_categorie_query
    ]

    # 4. Métriques globales
    total_revenus = sum(c.total_revenus for c in cultures_stats)
    total_depenses = sum(c.total_depenses for c in cultures_stats)
    benefice_total = total_revenus - total_depenses

    roi_moyen = float((benefice_total / total_depenses * 100)) if total_depenses > 0 else 0
    marge_beneficiaire = float((benefice_total / total_revenus * 100)) if total_revenus > 0 else 0
    
    cultures_avec_rendement = [c.rendement for c in cultures_stats if c.rendement > 0]
    productivite_moyenne = float(sum(cultures_avec_rendement) / len(cultures_avec_rendement)) if cultures_avec_rendement else 0
    
    efficacite_couts = float(total_revenus / total_depenses) if total_depenses > 0 else 0

    # 5. Insights
    insights = []
    if roi_moyen > 50:
        insights.append({
            'type': 'success',
            'title': 'Excellente Rentabilité',
            'message': f'Votre ROI moyen de {roi_moyen:.1f}% est exceptionnel.',
            'recommendation': 'Continuez vos méthodes actuelles et envisagez d\'étendre vos superficies.'
        })
    elif roi_moyen < 10 and total_revenus > 0:
        insights.append({
            'type': 'warning',
            'title': 'Rentabilité à Surveiller',
            'message': f'Votre ROI de {roi_moyen:.1f}% est assez faible.',
            'recommendation': 'Analysez vos postes de dépenses, notamment la main d\'œuvre et les intrants.'
        })

    if rendement_par_culture:
        top_culture = max(cultures_stats, key=lambda x: x.rendement)
        insights.append({
            'type': 'info',
            'title': 'Meilleure Performance',
            'message': f'Le {top_culture.nom} a le meilleur rendement avec {top_culture.rendement:.1f} kg/ha.',
            'recommendation': 'Identifiez les facteurs clés de succès de cette culture pour les appliquer aux autres.'
        })

    # 6. Objectifs (Simulés pour l'instant)
    objectifs = {
        'revenus': {
            'nom': 'Objectif Revenus Annuel',
            'actuel': float(total_revenus),
            'cible': 2000000,
            'pourcentage': float(min(total_revenus / 2000000 * 100, 150)) if 2000000 > 0 else 0
        },
        'rendement': {
            'nom': 'Objectif Rendement Moyen',
            'actuel': float(productivite_moyenne),
            'cible': 1000,
            'pourcentage': float(min(productivite_moyenne / 1000 * 100, 150)) if 1000 > 0 else 0
        }
    }

    return Response({
        'revenus_par_mois': evolution_mensuelle,  # Gardé pour compatibilité frontend
        'evolution_mensuelle': evolution_mensuelle,
        'tendance_cumulative': tendance_cumulative,
        'rendement_par_culture': rendement_par_culture,
        'benefice_par_culture': benefice_par_culture,
        'depenses_par_categorie': depenses_par_categorie,
        'roi_moyen': roi_moyen,
        'marge_beneficiaire': marge_beneficiaire,
        'productivite_moyenne': productivite_moyenne,
        'efficacite_couts': efficacite_couts,
        'insights': insights,
        'objectifs': objectifs
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


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def chatbot_view(request):
    """
    Vue pour interagir avec le chatbot Gemini en utilisant les données de l'utilisateur.
    Gère maintenant l'historique des conversations.
    """
    user = request.user
    message_text = request.data.get('message')
    conversation_id = request.data.get('conversation_id')
    
    if not message_text:
        return Response({'error': 'Le message est requis'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Gestion de la conversation
    if conversation_id:
        try:
            conversation = Conversation.objects.get(id=conversation_id, utilisateur=user)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation introuvable'}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Créer une nouvelle conversation avec un titre basé sur le premier message
        titre = message_text[:50] + "..." if len(message_text) > 50 else message_text
        conversation = Conversation.objects.create(utilisateur=user, titre=titre)
    
    # Sauvegarder le message de l'utilisateur
    MessageChat.objects.create(
        conversation=conversation,
        est_utilisateur=True,
        contenu=message_text
    )
    
    # Rassembler toutes les données de l'utilisateur pour le contexte
    cultures = Culture.objects.filter(utilisateur=user)
    recoltes = Recolte.objects.filter(culture__utilisateur=user)
    depenses = Depense.objects.filter(utilisateur=user)
    
    # On utilise les sérialiseurs pour formater les données
    cultures_data = CultureSerializer(cultures, many=True).data
    recoltes_data = RecolteSerializer(recoltes, many=True).data
    depenses_data = DepenseSerializer(depenses, many=True).data
    
    # Calcul rapide des stats pour le contexte
    revenus_totaux = sum((r.quantite_recoltee * r.prix_vente_unitaire for r in recoltes), Decimal('0'))
    depenses_totales = (
        sum((c.cout_achat_semences + c.cout_main_oeuvre for c in cultures), Decimal('0')) +
        sum((r.depenses_liees_recolte for r in recoltes), Decimal('0')) +
        sum((d.montant for d in depenses), Decimal('0'))
    )
    
    user_data = {
        'cultures': cultures_data,
        'recoltes': recoltes_data,
        'depenses': depenses_data,
        'stats': {
            'revenus_totaux': float(revenus_totaux),
            'depenses_totales': float(depenses_totales),
            'benefice_net': float(revenus_totaux - depenses_totales),
        }
    }
    
    # Ajouter le nom de la culture pour les récoltes
    for r in user_data['recoltes']:
        culture = next((c for c in cultures if c.id == r['culture']), None)
        r['culture_nom'] = culture.nom if culture else "Inconnue"

    # Appeler le service Gemini
    ai_service = GeminiService()
    
    # Récupérer l'historique récent pour le contexte (optionnel, à implémenter dans ai_service)
    # history = conversation.messages.order_by('date_envoi')[:10]
    
    response_text = ai_service.generate_response(user_data, message_text)
    
    # Sauvegarder la réponse de l'IA
    MessageChat.objects.create(
        conversation=conversation,
        est_utilisateur=False,
        contenu=response_text,
        contexte_donnees=user_data # On sauvegarde le contexte utilisé
    )
    
    return Response({
        'response': response_text,
        'conversation_id': conversation.id
    })


class ConversationListView(generics.ListAPIView):
    """
    Vue pour lister les conversations de l'utilisateur.
    """
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(utilisateur=self.request.user)


class ConversationDetailView(generics.RetrieveAPIView):
    """
    Vue pour récupérer les détails d'une conversation (avec ses messages).
    """
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Conversation.objects.filter(utilisateur=self.request.user)


class RapportIAListView(generics.ListAPIView):
    """
    Vue pour lister les rapports IA de l'utilisateur.
    """
    serializer_class = RapportIASerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return RapportIA.objects.filter(utilisateur=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_rapport_view(request):
    """
    Vue pour générer un nouveau rapport d'analyse IA.
    """
    user = request.user
    
    # 1. Rassembler les données
    cultures = Culture.objects.filter(utilisateur=user)
    recoltes = Recolte.objects.filter(culture__utilisateur=user)
    depenses = Depense.objects.filter(utilisateur=user)
    
    cultures_data = CultureSerializer(cultures, many=True).data
    recoltes_data = RecolteSerializer(recoltes, many=True).data
    depenses_data = DepenseSerializer(depenses, many=True).data
    
    # Calculs stats rapides
    revenus_totaux = sum((r.quantite_recoltee * r.prix_vente_unitaire for r in recoltes), Decimal('0'))
    depenses_totales = (
        sum((c.cout_achat_semences + c.cout_main_oeuvre for c in cultures), Decimal('0')) +
        sum((r.depenses_liees_recolte for r in recoltes), Decimal('0')) +
        sum((d.montant for d in depenses), Decimal('0'))
    )
    
    user_data = {
        'cultures': cultures_data,
        'recoltes': recoltes_data,
        'depenses': depenses_data,
        'stats': {
            'revenus_totaux': float(revenus_totaux),
            'depenses_totales': float(depenses_totales),
            'benefice_net': float(revenus_totaux - depenses_totales),
        }
    }
    
    # Enrichir les données de récolte
    for r in user_data['recoltes']:
        culture = next((c for c in cultures if c.id == r['culture']), None)
        r['culture_nom'] = culture.nom if culture else "Inconnue"

    # 2. Récupérer le résumé du dernier rapport pour la progression
    last_report = RapportIA.objects.filter(utilisateur=user).first()
    previous_summary = None
    if last_report:
        previous_summary = f"Dernier rapport ({last_report.date_creation}) : {last_report.analyse_complete[:500]}..."

    # 3. Appeler l'IA
    ai_service = GeminiService()
    report_data = ai_service.generate_full_report(user_data, previous_summary)
    
    if not report_data:
        return Response(
            {'error': 'Impossible de générer le rapport pour le moment. Veuillez réessayer.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    # 4. Sauvegarder le rapport
    rapport = RapportIA.objects.create(
        utilisateur=user,
        titre=report_data.get('titre', 'Rapport d\'analyse'),
        donnees_graphiques=report_data.get('donnees_graphiques', {}),
        analyse_complete=report_data.get('analyse_complete', ''),
        propositions_amelioration=report_data.get('propositions_amelioration', ''),
        points_progression=report_data.get('points_progression', '')
    )
    
    # 5. Générer le PDF
    try:
        pdf_path = generate_report_pdf(rapport)
        rapport.pdf_file = pdf_path
        rapport.save()
    except Exception as e:
        print(f"Erreur génération PDF: {e}")
        # On continue même si le PDF échoue, l'utilisateur aura au moins les données
    
    return Response(RapportIASerializer(rapport).data)
class SupportMessageListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des messages de support.
    """
    serializer_class = SupportMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SupportMessage.objects.filter(utilisateur=self.request.user)

    def perform_create(self, serializer):
        serializer.save(utilisateur=self.request.user)


class ProduitAnnonceListView(generics.ListAPIView):
    """
    Vue publique pour lister les annonces publiées.
    """
    serializer_class = ProduitAnnonceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = ProduitAnnonce.objects.filter(est_publie=True)
        categorie = self.request.query_params.get('categorie')
        if categorie:
            queryset = queryset.filter(categorie=categorie)
        return queryset


class ProduitAnnonceCreateView(generics.CreateAPIView):
    """
    Vue pour créer une annonce (nécessite d'être connecté).
    """
    serializer_class = ProduitAnnonceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(utilisateur=self.request.user)


class ProduitAnnonceDetailView(generics.RetrieveAPIView):
    """
    Vue pour voir les détails d'une annonce.
    """
    queryset = ProduitAnnonce.objects.all()
    serializer_class = ProduitAnnonceSerializer
    permission_classes = [permissions.AllowAny]


class MesAnnoncesListView(generics.ListAPIView):
    """
    Vue pour lister les annonces de l'utilisateur connecté.
    """
    serializer_class = ProduitAnnonceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProduitAnnonce.objects.filter(utilisateur=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def simuler_paiement_annonce(request, pk):
    """
    Simule le paiement des frais de mise en rayon.
    """
    try:
        annonce = ProduitAnnonce.objects.get(pk=pk, utilisateur=request.user)
        annonce.paiement_effectue = True
        annonce.est_publie = True
        annonce.save()
        return Response({'status': 'success', 'message': 'Paiement effectué et annonce publiée !'})
    except ProduitAnnonce.DoesNotExist:
        return Response({'status': 'error', 'message': 'Annonce non trouvée.'}, status=status.HTTP_404_NOT_FOUND)

