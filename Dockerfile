# Etapa 1: Construcción del frontend
FROM node:20 AS build-frontend

WORKDIR /app

# Copiar package.json y package-lock.json para cachear npm install
COPY package*.json ./

RUN npm install

# Copiar el código fuente completo necesario para el build
COPY src/ ./src
COPY public/ ./public      

RUN npm run build          # Ejecuta el build (genera /app/build)

# Etapa 2: Backend + frontend listo para producción
FROM node:20

WORKDIR /app/backend

# Copiar package.json y package-lock.json para instalar dependencias
COPY backend/package*.json ./

RUN npm install

# Copiar todo el backend (db.js, server.js, routes, middleware, etc.)
COPY backend/ ./

# Copiar build frontend generado en carpeta pública para servirlo
COPY --from=build-frontend /app/build ../public

EXPOSE 5000

CMD ["node", "server.js"]
