# © 2025 - Développé par Marino ATOHOUN (RinoGeek)
try:
    import google.generativeai as genai
except ImportError:
    genai = None

from django.conf import settings
import json

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key and genai:
            genai.configure(api_key=self.api_key)
            # Liste mise à jour selon les tests réussis
            self.model_names = [
                'gemini-1.5-flash',
                'gemini-1.5-pro',
                'gemini-pro'
            ]
            self.model = None
            # On ne peut pas tester la validité ici sans faire une requête
        else:
            self.model = None

    def generate_response(self, user_data, user_message, chat_history=None):
        if not self.api_key:
            return "L'API Gemini n'est pas configurée. Veuillez ajouter votre clé API dans le fichier .env."

        # Préparer le contexte
        context = self._prepare_context(user_data)
        system_instruction = f"""
        Tu es un assistant agricole expert nommé "Agri-Conseiller". 
        Ton rôle est d'aider l'agriculteur à gérer son exploitation en te basant sur ses données réelles.
        
        Voici les données actuelles de l'utilisateur :
        {context}
        
        Instructions :
        1. Utilise TOUJOURS les données fournies pour donner des réponses précises.
        2. Sois encourageant, professionnel et pratique.
        3. Si l'utilisateur pose une question sur ses performances, analyse ses cultures, récoltes et dépenses.
        4. Donne des conseils pour améliorer le rendement ou réduire les dépenses si tu remarques des anomalies.
        5. Réponds en français de manière claire et concise.
        6. Si tu ne trouves pas l'information dans les données, précise-le poliment.
        """

        full_prompt = f"{system_instruction}\n\nUtilisateur: {user_message}\nAgri-Conseiller:"

        # Essayer les modèles un par un
        last_error = ""
        for model_name in self.model_names:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(full_prompt)
                return response.text
            except Exception as e:
                last_error = str(e)
                # Si c'est une erreur de quota ou de modèle non trouvé, on continue
                if "404" in last_error or "not found" in last_error.lower() or "429" in last_error:
                    continue 
                # Pour les autres erreurs (auth, etc.), on peut s'arrêter ou continuer selon la stratégie
                # Ici on continue pour essayer les autres modèles au cas où
                continue

        return f"Désolé, je rencontre des difficultés techniques pour joindre l'IA. (Dernière erreur: {last_error}). Vérifiez votre connexion ou réessayez plus tard."

    def _prepare_context(self, data):
        """Formate les données utilisateur en une chaîne lisible pour l'IA."""
        context = "DONNÉES DE L'EXPLOITATION :\n"
        
        # Cultures
        context += "\n--- CULTURES ---\n"
        if data.get('cultures'):
            for c in data['cultures']:
                context += f"- {c['nom']} : semée le {c['date_culture']}, superficie {c['superficie']} ha, coût semences {c['cout_achat_semences']} FCFA, main d'œuvre {c['cout_main_oeuvre']} FCFA.\n"
        else:
            context += "Aucune culture enregistrée.\n"

        # Récoltes
        context += "\n--- RÉCOLTES ---\n"
        if data.get('recoltes'):
            for r in data['recoltes']:
                context += f"- Récolte de {r['culture_nom']} le {r['date_recolte']} : {r['quantite_recoltee']} {r['unite_recolte']}, prix vente {r['prix_vente_unitaire']} FCFA/unité, dépenses récolte {r['depenses_liees_recolte']} FCFA.\n"
        else:
            context += "Aucune récolte enregistrée.\n"

        # Dépenses
        context += "\n--- DÉPENSES GÉNÉRALES ---\n"
        if data.get('depenses'):
            for d in data['depenses']:
                context += f"- {d['description']} ({d['categorie']}) : {d['montant']} FCFA le {d['date_depense']}.\n"
        else:
            context += "Aucune dépense générale enregistrée.\n"

        # Statistiques globales
        stats = data.get('stats', {})
        context += "\n--- STATISTIQUES GLOBALES ---\n"
        context += f"- Revenus totaux : {stats.get('revenus_totaux', 0)} FCFA\n"
        context += f"- Dépenses totales : {stats.get('depenses_totales', 0)} FCFA\n"
        context += f"- Bénéfice net : {stats.get('benefice_net', 0)} FCFA\n"
        context += f"- Rendement moyen : {stats.get('rendement_moyen', 0)}\n"
        context += f"- Culture la plus rentable : {stats.get('culture_plus_rentable', 'N/A')}\n"

        return context

    def generate_full_report(self, user_data, previous_reports_summary=None):
        """
        Génère un rapport d'analyse complet et structuré au format JSON.
        """
        if not self.api_key:
            return None

        context = self._prepare_context(user_data)
        
        history_context = ""
        if previous_reports_summary:
            history_context = f"\nVoici un résumé des rapports précédents pour analyser la progression :\n{previous_reports_summary}"

        prompt = f"""
        Tu es un expert en analyse de données agricoles et conseiller stratégique.
        Ta mission est de générer un rapport d'analyse complet pour un agriculteur basé sur ses données.
        
        DONNÉES ACTUELLES :
        {context}
        {history_context}
        
        INSTRUCTIONS DE RÉPONSE :
        Réponds UNIQUEMENT avec un objet JSON valide ayant la structure suivante :
        {{
            "titre": "Titre accrocheur du rapport",
            "analyse_complete": "Analyse détaillée en Markdown (environ 500 mots). Inclure une analyse des revenus vs dépenses, de la productivité et de la santé globale de l'exploitation.",
            "propositions_amelioration": "Liste de 3 à 5 propositions concrètes en Markdown pour améliorer les résultats.",
            "points_progression": "Analyse de l'évolution par rapport au passé ou points forts identifiés en Markdown.",
            "donnees_graphiques": {{
                "evolution_financiere": [
                    {{"label": "Jan", "revenus": 1000, "depenses": 800}},
                    ... (données basées sur la réalité ou projections réalistes si données manquantes)
                ],
                "repartition_depenses": [
                    {{"name": "Semences", "value": 500}},
                    ...
                ],
                "performance_cultures": [
                    {{"nom": "Maïs", "rendement": 5.2, "moyenne_regionale": 4.5}},
                    ...
                ]
            }}
        }}
        
        CONSIGNES :
        1. L'analyse doit être professionnelle, encourageante et basée sur des faits.
        2. Utilise le Markdown pour le formatage du texte (gras, listes, titres).
        3. Assure-toi que le JSON est parfaitement valide.
        4. Si les données sont insuffisantes pour certains graphiques, fais des estimations réalistes basées sur le type d'agriculture.
        """

        for model_name in self.model_names:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                
                # Nettoyer la réponse pour ne garder que le JSON
                text = response.text
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0]
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0]
                
                return json.loads(text.strip())
            except Exception as e:
                print(f"Erreur avec {model_name}: {e}")
                continue

        return None
