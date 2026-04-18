
# Utiliser une image Node officielle légère
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Installer les dépendances
# Note: On utilise --legacy-peer-deps si nécessaire pour éviter les conflits
RUN npm install

# Copier le reste du code frontend
COPY . .

# Argument de build pour l'URL du backend
# Valeur par défaut vers le space backend (Hardcodé pour être sûr)
ENV VITE_API_BASE_URL=https://rinogeek-agrigestionbackend.hf.space/api

# Construire l'application pour la production
RUN npm run build

# Installer 'serve' pour servir l'application statique
RUN npm install -g serve

# Exposer le port 7860 (requis par Hugging Face Spaces)
ENV PORT=7860
EXPOSE 7860

# Démarrer le serveur statique sur le port 7860
CMD ["serve", "-s", "dist", "-l", "7860"]
