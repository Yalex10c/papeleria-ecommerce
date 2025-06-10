# Etapa 1: Construcción del frontend
FROM node:20 AS build-frontend

WORKDIR /app

# Copiamos solo lo necesario para construir el frontend
COPY src/ ./src
COPY package*.json ./

RUN npm install
RUN npm run build

# Etapa 2: Backend + frontend listo para producción
FROM node:20

WORKDIR /app

# Copiar archivos del backend
COPY backend/server.js ./
COPY backend/routes ./routes
COPY backend/middleware ./middleware  
COPY package*.json ./

RUN npm install

# Copiar build del frontend generado
COPY --from=build-frontend /app/dist ./public

# Exponer el puerto
EXPOSE 5000

# Comando de arranque
CMD ["node", "server.js"]
