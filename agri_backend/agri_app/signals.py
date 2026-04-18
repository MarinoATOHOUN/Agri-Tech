# © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
"""
Signaux Django pour déclencher des notifications automatiques.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal
from .models import Culture, Recolte, Depense, RapportIA, ConseilAgricole, Utilisateur

@receiver(post_save, sender=Utilisateur)
def notify_welcome(sender, instance, created, **kwargs):
    """Déclenche une notification de bienvenue lors de la création d'un compte."""
    if created:
        ConseilAgricole.objects.create(
            utilisateur=instance,
            titre="Bienvenue sur GreenMetric !",
            contenu=f"Bonjour {instance.first_name}, nous sommes ravis de vous accompagner dans la gestion de votre exploitation. Commencez par ajouter votre première culture pour bénéficier de nos conseils !",
            type_conseil='technique',
            priorite='moyenne'
        )

@receiver(post_save, sender=Culture)
def notify_new_culture(sender, instance, created, **kwargs):
    """Déclenche une notification lors de la création d'une nouvelle culture."""
    if created:
        ConseilAgricole.objects.create(
            utilisateur=instance.utilisateur,
            titre=f"Nouvelle culture : {instance.nom}",
            contenu=f"Félicitations pour votre nouvelle culture de {instance.nom} sur {instance.superficie} ha. N'oubliez pas de noter toutes vos dépenses pour un suivi précis de votre rentabilité.",
            type_conseil='culture',
            priorite='basse'
        )

@receiver(post_save, sender=Recolte)
def notify_new_recolte(sender, instance, created, **kwargs):
    """Déclenche des notifications lors de l'enregistrement d'une récolte."""
    if created:
        # Notification de base
        ConseilAgricole.objects.create(
            utilisateur=instance.culture.utilisateur,
            titre=f"Récolte enregistrée : {instance.culture.nom}",
            contenu=f"Vous avez récolté {instance.quantite_recoltee} {instance.unite_recolte} de {instance.culture.nom}. Revenu estimé : {instance.revenus_totaux:,.0f} FCFA.",
            type_conseil='rendement',
            priorite='moyenne'
        )

        # Conseil basé sur la qualité
        if instance.qualite_recolte in ['excellente', 'bonne']:
            ConseilAgricole.objects.create(
                utilisateur=instance.culture.utilisateur,
                titre="Excellente qualité !",
                contenu=f"Votre récolte de {instance.culture.nom} est de qualité {instance.qualite_recolte}. Assurez-vous d'utiliser des conditions de stockage optimales pour maintenir ce niveau de prix.",
                type_conseil='technique',
                priorite='basse'
            )
        elif instance.qualite_recolte in ['moyenne', 'faible']:
            ConseilAgricole.objects.create(
                utilisateur=instance.culture.utilisateur,
                titre="Amélioration de la qualité",
                contenu=f"La qualité de votre récolte de {instance.culture.nom} est jugée {instance.qualite_recolte}. Pensez à consulter notre IA pour analyser vos méthodes de culture et d'amendement du sol.",
                type_conseil='rendement',
                priorite='haute'
            )

@receiver(post_save, sender=Depense)
def notify_high_expense(sender, instance, created, **kwargs):
    """Déclenche une alerte pour les dépenses importantes."""
    if created and instance.montant > Decimal('100000'):
        ConseilAgricole.objects.create(
            utilisateur=instance.utilisateur,
            titre="Alerte : Dépense importante",
            contenu=f"Une dépense de {instance.montant:,.0f} FCFA ({instance.description}) a été enregistrée. Surveillez votre budget pour maintenir une rentabilité positive sur cette saison.",
            type_conseil='economique',
            priorite='haute'
        )

@receiver(post_save, sender=RapportIA)
def notify_new_report(sender, instance, created, **kwargs):
    """Informe l'utilisateur quand un nouveau rapport IA est prêt."""
    if created:
        ConseilAgricole.objects.create(
            utilisateur=instance.utilisateur,
            titre="Nouveau rapport d'analyse disponible",
            contenu=f"Votre rapport '{instance.titre}' a été généré avec succès. Consultez-le pour découvrir nos recommandations stratégiques pour votre exploitation.",
            type_conseil='technique',
            priorite='moyenne'
        )
