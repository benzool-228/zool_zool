FROM node:18-alpine

# Installer Git et Python (nécessaires pour certaines dépendances npm)
RUN apk add --no-cache git python3 make g++

WORKDIR /app

COPY package.json .

# Installer les dépendances SANS utiliser git
RUN npm config set update-notifier false && \
    npm install --production --no-optional --no-audit

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]