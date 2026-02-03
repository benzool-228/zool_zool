# Utilise une image Node.js légère et stable
FROM node:18-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copie les fichiers de dépendances
COPY package*.json ./

# Nettoie le cache npm et installe les dépendances de production
RUN npm cache clean --force && \
    npm ci --only=production --no-audit

# Copie le code source de l'application
COPY . .

# Déclare le port utilisé par l'application
EXPOSE 3000

# Commande pour démarrer l'application
CMD [ "node", "index.js" ]