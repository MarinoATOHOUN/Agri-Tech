# © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
import os
import json
from openai import OpenAI
from django.conf import settings

class GroqService:
    def __init__(self):
        self.api_key = getattr(settings, 'GROQ_API_KEY', os.environ.get("GROQ_API_KEY"))
        self.base_url = "https://api.groq.com/openai/v1"
        # Les trois modèles demandés pour le système de relais
        self.model_names = [
            "openai/gpt-oss-20b",
            "openai/gpt-oss-120b",
            "llama-3.3-70b-versatile"
        ]
        
        if self.api_key:
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=self.base_url,
            )
        else:
            self.client = None

    def _call_with_relay(self, prompt, system_instruction=None, is_json=False):
        """Système de relais : essaie les modèles un par un en cas d'erreur ou de limite."""
        if not self.client:
            return None, "Clé API Groq non configurée."

        last_error = ""
        for model_name in self.model_names:
            try:
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})

                # Note: On utilise chat.completions car c'est le standard Groq/OpenAI.
                # Si le modèle supporte le format JSON (comme llama-3-70b), on peut l'activer.
                extra_args = {}
                if is_json and "llama" in model_name.lower():
                    extra_args["response_format"] = {"type": "json_object"}

                response = self.client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    **extra_args
                )
                
                return response.choices[0].message.content, None
            except Exception as e:
                last_error = str(e)
                print(f"Erreur avec le modèle {model_name} : {last_error}")
                # En cas de quota (429) ou autre erreur, on passe au modèle suivant
                continue
        
        return None, f"Tous les modèles Groq ont échoué. Dernière erreur : {last_error}"

    def generate_response(self, user_data, user_message, chat_history=None):
        if not self.api_key:
            return "L'API Groq n'est pas configurée. Veuillez ajouter votre clé API dans le fichier .env."

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
        4. Donne des conseils pour améliorer le rendement ou réduire les denses si tu remarques des anomalies.
        5. Réponds en français de manière claire et concise.
        6. Si tu ne trouves pas l'information dans les données, précise-le poliment.
        """

        response_text, error = self._call_with_relay(user_message, system_instruction)
        
        if error:
            return f"Désolé, je rencontre des difficultés techniques : {error}. Vérifiez votre connexion ou réessayez plus tard."
        
        return response_text

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

        system_instruction = """
        Tu es un expert en analyse de données agricoles et conseiller stratégique.
        Ta mission est de générer un rapport d'analyse complet pour un agriculteur basé sur ses données.
        Réponds UNIQUEMENT avec un objet JSON valide.
        """

        prompt = f"""
        DONNÉES ACTUELLES :
        {context}
        {history_context}
        
        INSTRUCTIONS DE RÉPONSE :
        Génère un objet JSON ayant la structure suivante :
        {{
            "titre": "Titre accrocheur du rapport",
            "analyse_complete": "Analyse détaillée en Markdown (environ 500 mots).",
            "propositions_amelioration": "Liste de 3 à 5 propositions concrètes en Markdown.",
            "points_progression": "Analyse de l'évolution par rapport au passé en Markdown.",
            "donnees_graphiques": {{
                "evolution_financiere": [{{"label": "Jan", "revenus": 1000, "depenses": 800}}],
                "repartition_depenses": [{{"name": "Semences", "value": 500}}],
                "performance_cultures": [{{"nom": "Maïs", "rendement": 5.2, "moyenne_regionale": 4.5}}]
            }}
        }}
        """

        response_text, error = self._call_with_relay(prompt, system_instruction, is_json=True)
        
        if error or not response_text:
            return None

        try:
            # Nettoyer la réponse pour ne garder que le JSON
            text = response_text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            
            return json.loads(text.strip())
        except Exception as e:
            print(f"Erreur lors du parsing JSON : {e}")
            return None

