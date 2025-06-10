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

# Copiar package.json y package-lock.json para instalar dependencias
COPY backend/package*.json ./

RUN npm install

# Copiar archivos backend necesarios
COPY backend/db.js ./
COPY backend/server.js ./
COPY backend/routes ./routes
COPY backend/middleware ./middleware

# Copiar build frontend generado
COPY --from=build-frontend /app/build ./public

EXPOSE 5000

CMD ["node", "server.js"]
