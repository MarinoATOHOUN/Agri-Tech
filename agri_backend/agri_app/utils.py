# © 2025 - Développé par BlackBenAI (Fondateur: Marino ATOHOUN)
import os
import tempfile
from django.conf import settings
from fpdf import FPDF
from datetime import datetime
import matplotlib
matplotlib.use('Agg') # Backend non-interactif pour serveur
import matplotlib.pyplot as plt
import numpy as np

class PDFReport(FPDF):
    def header(self):
        # Bandeau supérieur vert
        self.set_fill_color(22, 163, 74) # Green-600
        self.rect(0, 0, 210, 40, 'F')
        
        # Titre de l'application
        self.set_font('helvetica', 'B', 24)
        self.set_text_color(255, 255, 255)
        self.set_xy(10, 10)
        self.cell(0, 15, 'GreenMetric', border=False, ln=True)
        
        # Sous-titre
        self.set_font('helvetica', 'I', 12)
        self.set_text_color(240, 253, 244) # Green-50
        self.cell(0, 10, 'L\'intelligence artificielle au service de votre exploitation', border=False, ln=True)
        
        self.ln(20)

    def footer(self):
        self.set_y(-20)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'GreenMetric - Rapport généré le {datetime.now().strftime("%d/%m/%Y à %H:%M")} - Page {self.page_no()}/{{nb}}', align='C')

    def chapter_title(self, title, icon_char=None):
        self.set_font('helvetica', 'B', 16)
        self.set_text_color(22, 163, 74) # Green-600
        self.cell(0, 10, title, ln=True, align='L')
        # Ligne de séparation
        self.set_draw_color(22, 163, 74)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

    def chapter_body(self, body):
        self.set_font('helvetica', '', 11)
        self.set_text_color(55, 65, 81) # Gray-700
        
        # Nettoyage basique du Markdown
        clean_text = body.replace('**', '').replace('##', '').replace('#', '').replace('* ', '• ')
        
        # Encodage pour FPDF (latin-1)
        # On remplace les caractères non supportés par '?' pour éviter le crash
        try:
            clean_text = clean_text.encode('latin-1', 'replace').decode('latin-1')
        except:
            pass
            
        self.multi_cell(0, 6, clean_text)
        self.ln()

def generate_chart_evolution(data):
    """Génère un graphique en barres pour l'évolution financière."""
    if not data:
        return None
        
    labels = [d['label'] for d in data]
    revenus = [d['revenus'] for d in data]
    depenses = [d['depenses'] for d in data]
    
    x = np.arange(len(labels))
    width = 0.35
    
    fig, ax = plt.subplots(figsize=(8, 4))
    rects1 = ax.bar(x - width/2, revenus, width, label='Revenus', color='#10B981')
    rects2 = ax.bar(x + width/2, depenses, width, label='Dépenses', color='#EF4444')
    
    ax.set_ylabel('Montant (FCFA)')
    ax.set_title('Évolution Financière')
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.legend()
    
    # Style minimaliste
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.grid(axis='y', linestyle='--', alpha=0.7)
    
    tmp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    plt.savefig(tmp_file.name, bbox_inches='tight', dpi=100)
    plt.close(fig)
    return tmp_file.name

def generate_chart_repartition(data):
    """Génère un diagramme circulaire pour la répartition des dépenses."""
    if not data:
        return None
        
    labels = [d['name'] for d in data]
    sizes = [d['value'] for d in data]
    colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']
    
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors[:len(labels)])
    ax.axis('equal')
    ax.set_title('Répartition des Dépenses')
    
    tmp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    plt.savefig(tmp_file.name, bbox_inches='tight', dpi=100)
    plt.close(fig)
    return tmp_file.name

def generate_report_pdf(rapport_obj):
    """
    Génère un fichier PDF riche à partir d'un objet RapportIA.
    """
    pdf = PDFReport()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=25)
    
    # Titre du rapport
    pdf.set_font('helvetica', 'B', 22)
    pdf.set_text_color(31, 41, 55) # Gray-800
    
    titre_safe = rapport_obj.titre
    try:
        titre_safe = titre_safe.encode('latin-1', 'replace').decode('latin-1')
    except:
        pass
        
    pdf.cell(0, 20, titre_safe, ln=True, align='C')
    pdf.ln(5)
    
    # --- GRAPHIQUES ---
    donnees = rapport_obj.donnees_graphiques
    if donnees:
        pdf.chapter_title("Indicateurs Clés")
        
        # Positionnement des graphiques côte à côte si possible, sinon l'un sous l'autre
        chart1_path = generate_chart_evolution(donnees.get('evolution_financiere'))
        chart2_path = generate_chart_repartition(donnees.get('repartition_depenses'))
        
        y_start = pdf.get_y()
        
        if chart1_path:
            pdf.image(chart1_path, x=10, y=y_start, w=90)
            os.unlink(chart1_path) # Supprimer le fichier temporaire
            
        if chart2_path:
            pdf.image(chart2_path, x=110, y=y_start, w=90)
            os.unlink(chart2_path)
            
        pdf.ln(60) # Espace pour les graphiques
    
    # --- ANALYSE ---
    pdf.chapter_title("Analyse Détaillée")
    pdf.chapter_body(rapport_obj.analyse_complete)
    
    # --- AMÉLIORATIONS ---
    pdf.chapter_title("Pistes d'Amélioration")
    pdf.chapter_body(rapport_obj.propositions_amelioration)
    
    # --- PROGRESSION ---
    pdf.chapter_title("Progression & Évolution")
    pdf.chapter_body(rapport_obj.points_progression)
    
    # Sauvegarde
    filename = f"rapport_{rapport_obj.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = os.path.join(settings.MEDIA_ROOT, 'rapports_pdf', filename)
    
    # Créer le dossier s'il n'existe pas
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    pdf.output(filepath)
    
    return f"rapports_pdf/{filename}"
