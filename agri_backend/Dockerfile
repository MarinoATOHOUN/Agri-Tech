
# Utiliser une image Python officielle légère
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Empêcher Python d'écrire des fichiers pyc et bufferiser stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Installer les dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copier le fichier requirements
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copier le reste du code
COPY . .

# Collecter les fichiers statiques
RUN python manage.py collectstatic --noinput

# Créer un utilisateur non-root pour la sécurité (recommandé par HF) et ajuster les permissions
RUN useradd -m -u 1000 user
RUN chown -R user:user /app && chmod -R 777 /app
USER user

# Exposer le port 7860 (Port standard Hugging Face Spaces)
ENV PORT=7860
EXPOSE 7860

# Commande de démarrage : Migrations -> Superuser -> Serveur
CMD ["sh", "-c", "python manage.py migrate && python create_superuser_script.py && gunicorn agri_backend.wsgi:application --bind 0.0.0.0:$PORT"]
