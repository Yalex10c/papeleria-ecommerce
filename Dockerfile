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

WORKDIR /app

# Copiar archivos del backend
COPY backend/server.js ./
COPY backend/routes ./routes
COPY backend/middleware ./middleware  
COPY package*.json ./

RUN npm install

# Copiar build del frontend generado en la etapa anterior
COPY --from=build-frontend /app/build ./public

# Exponer puerto de la app
EXPOSE 5000

# Comando para iniciar backend
CMD ["node", "server.js"]
