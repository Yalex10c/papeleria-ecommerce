# Etapa 1: Construcción del frontend
FROM node:20 AS frontend
WORKDIR /app
COPY src/ ./src
COPY package*.json ./
RUN npm install
RUN npm run build

# Etapa 2: Servidor backend + frontend
FROM node:20
WORKDIR /app

# Copiar backend
COPY server.js ./
COPY routes ./routes
COPY .env ./
COPY package*.json ./
RUN npm install

# Copiar frontend construido a /public
COPY --from=frontend /app/dist ./public

EXPOSE 5000
CMD ["node", "server.js"]
